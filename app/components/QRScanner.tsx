'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState, useRef } from 'react';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Slight delay to ensure DOM element "reader" is fully rendered and accessible
        const timer = setTimeout(async () => {
            if (!document.getElementById("reader")) return;

            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            try {
                // Check if we are in a secure context (HTTPS or localhost)
                if (!window.isSecureContext) {
                    throw new Error("Camera requires a secure context (HTTPS). On mobile, you MUST follow the Chrome Flags or ngrok steps in the instructions.");
                }

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        setScanResult(decodedText);
                        onScanSuccess(decodedText);
                        html5QrCode.stop().catch(err => console.error("Error stopping scanner", err));
                    },
                    (errorMessage) => {
                        // Ignore frequent errors like code not found
                        if (onScanFailure && !errorMessage.includes('NotFound')) {
                            // onScanFailure(errorMessage); // Optional: filter noise
                        }
                    }
                );
            } catch (err: any) {
                console.error("Failed to start scanner", err);
                if (onScanFailure) {
                    onScanFailure(err);
                }
            }
        }, 300); // 300ms delay for DOM readiness

        return () => {
            clearTimeout(timer);
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Error stopping scanner", err));
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div className="w-full max-w-md mx-auto">
            {!scanResult ? (
                <div id="reader" className="overflow-hidden rounded-xl shadow-lg border-2 border-slate-200 bg-black aspect-square max-w-md"></div>
            ) : (
                <div className="text-center p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/20 text-emerald-400">
                    <p className="font-bold">Scan Successful!</p>
                </div>
            )}
        </div>
    );
}
