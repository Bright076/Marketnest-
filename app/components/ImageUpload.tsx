"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ButtonSpinner } from "./LoadingSpinner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  bucketName?: string;
}

export default function ImageUpload({
  onUploadComplete,
  currentImageUrl = "",
  bucketName = "products",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError("");

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "0.5rem",
        }}
      >
        Product Image
      </label>

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div
          style={{
            marginBottom: "1rem",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <img
            src={previewUrl}
            alt="Product preview"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              padding: "1rem",
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={uploading}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: uploading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? "#16a34a" : "#d1d5db"}`,
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
          background: dragActive ? "#f0fdf4" : "#f9fafb",
          transition: "all 0.3s",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: "none" }}
        />

        {uploading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <ButtonSpinner color="#16a34a" />
            <p style={{ color: "#16a34a", fontWeight: 600, margin: 0 }}>
              Uploading image...
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              📸
            </div>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#374151",
                margin: "0 0 0.5rem",
              }}
            >
              {dragActive
                ? "Drop image here"
                : "Click to upload or drag and drop"}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>

      {/* Upload Info */}
      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          fontSize: "0.875rem",
          color: "#1e40af",
        }}
      >
        <strong>💡 Tip:</strong> Use high-quality images with white or
        transparent backgrounds for best results
      </div>
    </div>
  );
}
