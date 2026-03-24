"use client";

import React, { useState, useRef } from "react";

interface ReceiptSectionProps {
  orderId: string;
  orderNumber: string | undefined;
  siteContactPhone: string | null | undefined;
}

export default function ReceiptSection({
  orderId,
  orderNumber,
  siteContactPhone,
}: ReceiptSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phoneDigits = siteContactPhone?.replace(/\D/g, "") ?? "";
  const reference = orderNumber ?? orderId;
  const whatsAppMessage = `Hi, I've paid for my order. My order number is ${reference}. I'm sending my payment receipt in this chat.`;
  const submitReceiptViaWhatsAppHref =
    phoneDigits
      ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsAppMessage)}`
      : null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orderId) return;
    setUploadError(null);
    setUploadSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await fetch(`/api/order/${orderId}/receipt`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }
      setUploadSuccess(true);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-1 rounded-md p-6 mb-8 max-w-lg mx-auto text-left">
      <h3 className="font-medium text-lg text-dark mb-4">Submit your payment receipt</h3>
      <p className="text-dark-4 text-custom-sm mb-4">
        Upload your bank transfer receipt below or send it via WhatsApp. Use order
        number <strong>{reference}</strong> as reference.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="receipt-upload"
            className="block mb-2 text-dark text-custom-sm font-medium"
          >
            Upload receipt
          </label>
          <input
            ref={inputRef}
            id="receipt-upload"
            type="file"
            accept="image/*,.pdf"
            disabled={uploading}
            className="block w-full text-custom-sm text-dark-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-custom-sm file:font-medium file:bg-blue file:text-white file:cursor-pointer hover:file:bg-blue-dark disabled:opacity-50"
            onChange={handleUpload}
          />
          {uploading && (
            <p className="text-custom-sm text-dark-4 mt-1">Uploading…</p>
          )}
          {uploadSuccess && (
            <p className="text-custom-sm text-green mt-1">Receipt uploaded successfully.</p>
          )}
          {uploadError && (
            <p className="text-custom-sm text-red mt-1" role="alert">
              {uploadError}
            </p>
          )}
        </div>

        {submitReceiptViaWhatsAppHref && (
          <p className="text-dark text-custom-sm">
            Or{" "}
            <a
              href={submitReceiptViaWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-medium hover:underline"
            >
              submit receipt via WhatsApp
            </a>{" "}
            and send your receipt in the chat.
          </p>
        )}
      </div>
    </div>
  );
}
