
import sys
import json
import re
import os
import cv2
import numpy as np
import easyocr

# Ensure stdout uses utf-8
sys.stdout.reconfigure(encoding='utf-8')

def process_poster(image_path):
    try:
        # Initialize Reader (load into memory only once ideally, but script runs per request)
        reader = easyocr.Reader(['en'], gpu=False) # GPU false for stability on likely user machine

        # Read image
        result = reader.readtext(image_path)
        # result format: ([[x,y], [x,y], [x,y], [x,y]], text, conf)

        img = cv2.imread(image_path)
        if img is None:
            raise Exception("Failed to load image")

        height, width, _ = img.shape
        
        products = []
        found_prices = []
        lines = []

        # Convert result to simpler structure
        for (bbox, text, conf) in result:
            # bbox is list of 4 points. Get min/max for simple rect
            xs = [p[0] for p in bbox]
            ys = [p[1] for p in bbox]
            x0, x1 = min(xs), max(xs)
            y0, y1 = min(ys), max(ys)
            
            lines.append({
                'text': text,
                'bbox': {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1},
                'conf': conf
            })

        # Regex for price
        price_pattern = re.compile(r'\$?\d+\.\d{2}') # matches $1.29 or 1.29
        address_pattern = re.compile(r'\b\d{5}\b|\b(NC|SC|NY|NJ|CA|TX|FL)\b', re.IGNORECASE)

        detected_address = None

        # Pass 1: Identify Prices and Address
        for i, line in enumerate(lines):
            txt = line['text']
            
            # Check price
            price_match = price_pattern.search(txt)
            if price_match:
                # Extract float
                val_str = price_match.group(0).replace('$', '')
                try:
                    price_val = float(val_str)
                    found_prices.append({
                        'index': i,
                        'price': price_val,
                        'bbox': line['bbox']
                    })
                except:
                    pass
                continue

            # Check address (simple heuristic)
            if not detected_address and line['bbox']['y0'] > height * 0.8: # Bottom 20%
                if address_pattern.search(txt):
                    detected_address = txt

        # Pass 2: Associate Name with Price
        output_dir = os.path.join(os.path.dirname(os.path.dirname(image_path)), 'uploads')
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        base_url = f"http://localhost:{os.environ.get('PORT', '5050')}/uploads"

        for p_item in found_prices:
            p_idx = p_item['index']
            p_price = p_item['price']
            p_box = p_item['bbox']

            # Search for best name candidate
            # Criteria: Above the price, roughly centered horizontally, not another price
            best_line = None
            min_dist = float('inf')

            p_center_x = (p_box['x0'] + p_box['x1']) / 2
            
            for i, line in enumerate(lines):
                if i == p_idx: continue
                
                # Must be above
                if line['bbox']['y1'] > p_box['y0']: continue 
                
                # Check if it's a price (skip)
                if price_pattern.search(line['text']): continue

                # Text length filter
                clean_text = re.sub(r'[^a-zA-Z\s]', '', line['text']).strip()
                if len(clean_text) < 3: continue

                # Horizontal alignment
                l_center_x = (line['bbox']['x0'] + line['bbox']['x1']) / 2
                dist_x = abs(p_center_x - l_center_x)
                
                # Allow tolerance relative to box width
                width_tolerance = (p_box['x1'] - p_box['x0']) * 2 + 50
                
                if dist_x < width_tolerance:
                    # Vertical distance
                    dist_y = p_box['y0'] - line['bbox']['y1']
                    if dist_y < min_dist and dist_y < 600: # Max 600px gap
                        min_dist = dist_y
                        best_line = line

            if best_line:
                # We have a Pair: Name + Price
                # Crop logic
                # Top: Name Top
                # Bottom: Price Bottom
                # Left/Right: Union with padding
                
                name_box = best_line['bbox']
                
                # Determine crop coordinates
                c_x0 = min(name_box['x0'], p_box['x0'])
                c_x1 = max(name_box['x1'], p_box['x1'])
                c_y0 = name_box['y0']
                c_y1 = p_box['y1']
                
                # Add padding
                pad = 20
                c_x0 = max(0, int(c_x0 - pad))
                c_y0 = max(0, int(c_y0 - pad)) # Extra top padding for name?
                c_x1 = min(width, int(c_x1 + pad))
                c_y1 = min(height, int(c_y1 + pad))
                
                # Perform crop
                if c_x1 > c_x0 and c_y1 > c_y0:
                    crop_img = img[c_y0:c_y1, c_x0:c_x1]
                    
                    filename = f"prod_py_{p_idx}_{int(p_price*100)}.jpg"
                    save_path = os.path.join(output_dir, filename)
                    cv2.imwrite(save_path, crop_img)
                    
                    product_obj = {
                        'name': best_line['text'].strip(),
                        'price': p_price,
                        'image': f"{base_url}/{filename}",
                        'description': f"Imported. {detected_address if detected_address else ''}",
                        'category': 'Offers',
                        'offer': '🔥 Smart Deal',
                        'inStock': True
                    }
                    products.append(product_obj)

        result_json = {
            'products': products,
            'storeInfo': {'address': detected_address} if detected_address else None
        }
        
        print(json.dumps(result_json))

    except Exception as e:
        error_json = {'error': str(e)}
        print(json.dumps(error_json))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No image path provided'}))
        sys.exit(1)
    
    process_poster(sys.argv[1])
