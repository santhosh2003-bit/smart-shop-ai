import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExtractedProduct {
    name: string;
    price: number;
    description: string;
    category: string;
}

interface PosterUploaderProps {
    onProductsExtracted: (products: ExtractedProduct[]) => void;
    storeId: string;
}

const PosterUploader: React.FC<PosterUploaderProps> = ({ onProductsExtracted, storeId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('poster', file);

        setIsUploading(true);
        try {
            // Note: We need to implement this endpoint in backend
            const res = await fetch(`/api/stores/${storeId}/poster`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to analyze image');

            const data = await res.json();
            toast.success(`Found ${data.length} offers!`);
            onProductsExtracted(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to process poster');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="mb-6 border-dashed border-2">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    {preview ? (
                        <div className="relative w-full max-w-sm rounded-lg overflow-hidden border">
                            <img src={preview} alt="Poster preview" className="w-full h-auto" />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <span>Analyzing Offers...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-dashed rounded-full bg-muted/50">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-lg">AI Offer Extraction</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                            Upload a deal poster or flyer. Our AI will read the prices and product names automatically.
                        </p>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />
                            <Button disabled={isUploading}>
                                {isUploading ? 'Processing...' : 'Upload Poster'}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PosterUploader;
