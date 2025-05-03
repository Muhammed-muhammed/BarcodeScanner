// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { useFormikContext } from 'formik';

interface BarcodeScannerProps {
	fieldName: string;
	closeScanner: () => void;
	isOpen: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ fieldName, closeScanner, isOpen }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [error, setError] = useState<string | null>(null);
	const { setFieldValue } = useFormikContext();
	const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		const hints = new Map();
		const formats = [
			BarcodeFormat.CODE_128,
			BarcodeFormat.CODE_39,
			BarcodeFormat.EAN_13,
			BarcodeFormat.EAN_8,
			BarcodeFormat.UPC_A,
			BarcodeFormat.UPC_E,
			BarcodeFormat.ITF,
			BarcodeFormat.CODABAR,
			// BarcodeFormat.QR_CODE,
			BarcodeFormat.DATA_MATRIX,
		];


		hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
		codeReaderRef.current = new BrowserMultiFormatReader(hints);

		const startCamera = async () => {
			try {
				if (codeReaderRef.current && videoRef.current) {
					await codeReaderRef.current.decodeFromConstraints(
						{ video: { facingMode: 'environment', width: 1280, height: 720 }, audio: false },
						videoRef.current,
						(result: Result | undefined, error: any) => {
							if (result && !scanned) {
								setFieldValue(fieldName, result.getText());
								setScanned(true);
								codeReaderRef.current?.reset();
								closeScanner();
							}
							if (error && !(error instanceof Error)) {
								console.error("Scanning error:", error);
							}
						}
					);
					setError(null);
				}
			} catch (err) {
				console.error("Error accessing the camera", err);
				setError("Error accessing the camera. Please make sure you've granted camera permissions.");
			}
		};

		startCamera();

		return () => {
			if (codeReaderRef.current) {
				codeReaderRef.current.reset();
			}
		};
	}, [fieldName, scanned]);

	useEffect(() => {
		if (!isOpen) {
			setScanned(false);
		}
	}, [isOpen]);

	return (
		<div className="barcode-scanner-container">
			{isOpen ? (
				<>
					<div className="barcode-camera-box">
						<video ref={videoRef} className="barcode-camera-video" style={{ width: '100%', maxWidth: '500px' }} />
					</div>
					{error && <div className="barcode-error-message" style={{ color: 'red' }}>{error}</div>}
				</>
			) : (
				<div>No scanner active</div>
			)}
		</div>
	);
};

export default BarcodeScanner;
