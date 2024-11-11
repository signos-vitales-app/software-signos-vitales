// src/components/QRReaderPage.jsx
import React, { useState } from "react";
import QRReader from "../services/QRReader";
const QRReaderPage = () => {
    const [qrData, setQrData] = useState("");

    const handleQRCodeRead = (data) => {
        setQrData(data);
        alert(`Código QR leído: ${data}`);
    };

    return (
        <div>
            <h1>Escanear Código QR</h1>
            <QRReader onQRCodeRead={handleQRCodeRead} />
            <div>
                {qrData && <p>Datos del QR: {qrData}</p>}
            </div>
        </div>
    );
};

export default QRReaderPage;
