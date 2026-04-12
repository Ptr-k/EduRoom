package com.eduroom.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * SERVICIO PARA GENERAR CODIGOS QR
 * los codigos QR se usarán para registrar a los usuarios
 *
 * devuelve los urls en formato QR, en este caso
 * para registrar a los usuarios
 */
@Service
public class QrCodeService {

    // genera el codigo QR, ingresando la URL y el tamaño de la imagen.
    public byte[] generarQR(String url, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        // config. para mejorar la calidad del QR
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8"); // para carácteres especiales
        hints.put(EncodeHintType.MARGIN, 1);

        // convierte la URL en la cuadrícula y luego se pasa a PNG
        BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, width, height, hints);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

        // devuelve EN FORMATO BYTE
        return outputStream.toByteArray();
    }

    // otro método para lo mismo
    // genera la imagen ingresando solamente el QR, pero con el tamaño por defecto (300 x 300)
    public byte[] generarQR(String url) throws WriterException, IOException {
        return generarQR(url, 300, 300);
    }
}
