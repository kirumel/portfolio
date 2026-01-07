"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BlockEditor, { ContentBlock } from "./BlockEditor";
import "./PortfolioDetailModal.css";
import "./Modal.css";

interface NewProject {
  title: string;
  category: string;
  image: string;
  tags: string[];
  contentBlocks?: ContentBlock[];
  clientName?: string;
  clientImage?: string;
  clientYoutube?: string;
  clientTwitter?: string;
}

interface UploadModalProps {
  onClose: () => void;
  onUpload: (project: NewProject) => void;
}

const UploadModal = ({ onClose, onUpload }: UploadModalProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [clientYoutube, setClientYoutube] = useState("");
  const [clientTwitter, setClientTwitter] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!title || !category) {
      alert("제목과 카테고리를 입력해주세요.");
      return;
    }

    setSaving(true);
    const newProject: NewProject = {
      title,
      category,
      image: image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      contentBlocks: contentBlocks.length > 0 ? contentBlocks : undefined,
      clientName: clientName || undefined,
      clientImage: clientImage || undefined,
      clientYoutube: clientYoutube || undefined,
      clientTwitter: clientTwitter || undefined,
    };
    
    try {
      await onUpload(newProject);
      onClose();
    } catch (error) {
      console.error("Error uploading project:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getBlockWidth = (width?: ContentBlock["width"]) => {
    switch (width) {
      case "small":
        return "50%";
      case "medium":
        return "75%";
      case "large":
        return "90%";
      case "full":
      default:
        return "100%";
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "text":
        return (
          <div
            key={block.id}
            className="portfolio-detail-block portfolio-detail-block-text"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );

      case "image":
        return (
          <div
            key={block.id}
            className="portfolio-detail-block portfolio-detail-block-image"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="portfolio-detail-image-block"
              style={{ width: getBlockWidth(block.width) }}
            >
              <Image
                src={block.content}
                alt={title || "이미지"}
                width={1200}
                height={675}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        );

      case "youtube":
        return (
          <div
            key={block.id}
            className="portfolio-detail-block portfolio-detail-block-video"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="portfolio-detail-video-wrapper"
              style={{ width: getBlockWidth(block.width) }}
            >
              <iframe
                src={getYouTubeEmbedUrl(block.content)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="portfolio-detail-video"
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div
            key={block.id}
            className="portfolio-detail-block portfolio-detail-block-video"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="portfolio-detail-video-wrapper"
              style={{ width: getBlockWidth(block.width) }}
            >
              <video
                src={block.content}
                controls
                className="portfolio-detail-video"
                style={{ width: "100%" }}
              >
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="portfolio-detail-overlay" onClick={handleOverlayClick}>
        <motion.div
          className="portfolio-detail-modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="portfolio-detail-actions">
            <button
              className="portfolio-detail-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button className="portfolio-detail-close" onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="portfolio-detail-content">
            {/* 헤더 이미지 */}
            <div className="portfolio-detail-header">
              <div className="portfolio-detail-image-wrapper">
                {image ? (
                  <Image
                    src={image}
                    alt={title || "썸네일"}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: "rgba(55, 53, 47, 0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(55, 53, 47, 0.4)",
                    fontSize: "14px"
                  }}>
                    썸네일 이미지 URL을 입력하세요
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 0", marginBottom: "32px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const formData = new FormData();
                      formData.append("file", file);

                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      if (!response.ok) {
                        throw new Error("업로드 실패");
                      }

                      const data = await response.json();
                      setImage(data.url);
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      alert("이미지 업로드에 실패했습니다.");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid rgba(55, 53, 47, 0.16)",
                    borderRadius: "3px",
                    fontSize: "14px",
                    background: "transparent",
                    color: "rgba(55, 53, 47, 0.8)"
                  }}
                />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="또는 이미지 URL 입력"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid rgba(55, 53, 47, 0.16)",
                    borderRadius: "3px",
                    fontSize: "14px",
                    background: "transparent",
                    color: "rgba(55, 53, 47, 0.8)",
                    marginTop: "8px"
                  }}
                />
              </div>
            </div>

            {/* 프로젝트 정보 */}
            <div className="portfolio-detail-info">
              <div className="portfolio-detail-meta">
                {isEditingCategory ? (
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={() => setIsEditingCategory(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingCategory(false);
                    }}
                    placeholder="카테고리"
                    style={{
                      background: "rgba(55, 53, 47, 0.08)",
                      color: "rgba(55, 53, 47, 0.6)",
                      padding: "4px 10px",
                      borderRadius: "3px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 500,
                      minWidth: "100px"
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="portfolio-detail-category"
                    onClick={() => setIsEditingCategory(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {category || "카테고리 클릭하여 입력"}
                  </span>
                )}
                <span className="portfolio-detail-date">{formatDate()}</span>
              </div>

              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingTitle(false);
                  }}
                  placeholder="프로젝트 제목"
                  className="portfolio-detail-title-input"
                  autoFocus
                />
              ) : (
                <h1
                  className="portfolio-detail-title"
                  onClick={() => setIsEditingTitle(true)}
                  style={{ cursor: "pointer" }}
                >
                  {title || "제목을 클릭하여 입력하세요"}
                </h1>
              )}

              {isEditingTags ? (
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  onBlur={() => setIsEditingTags(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingTags(false);
                  }}
                  placeholder="태그 (쉼표로 구분)"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid rgba(55, 53, 47, 0.16)",
                    borderRadius: "3px",
                    fontSize: "14px",
                    marginTop: "16px",
                    background: "transparent",
                    color: "rgba(55, 53, 47, 0.8)"
                  }}
                  autoFocus
                />
              ) : (
                <div
                  className="portfolio-detail-tags"
                  onClick={() => setIsEditingTags(true)}
                  style={{ cursor: "pointer", minHeight: "40px" }}
                >
                  {tags ? (
                    tags.split(",").map((tag, index) => (
                      <span key={index} className="portfolio-detail-tag">
                        {tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "rgba(55, 53, 47, 0.4)", fontSize: "13px" }}>
                      태그를 클릭하여 입력하세요
                    </span>
                  )}
                </div>
              )}

              {/* 클라이언트 정보 입력 */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "rgba(55, 53, 47, 0.85)" }}>
                  클라이언트 정보 (선택사항)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", background: "rgba(55, 53, 47, 0.02)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(55, 53, 47, 0.08)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(55, 53, 47, 0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      클라이언트 이미지 URL
                    </label>
                    <input
                      type="url"
                      value={clientImage}
                      onChange={(e) => setClientImage(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid rgba(55, 53, 47, 0.16)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        background: "white",
                        color: "rgba(55, 53, 47, 0.85)"
                      }}
                    />
                    {clientImage && (
                      <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
                        <Image
                          src={clientImage}
                          alt="클라이언트 이미지 미리보기"
                          width={100}
                          height={100}
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(55, 53, 47, 0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      클라이언트 이름
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="클라이언트 이름"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid rgba(55, 53, 47, 0.16)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        background: "white",
                        color: "rgba(55, 53, 47, 0.85)"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(55, 53, 47, 0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      유튜브 URL
                    </label>
                    <input
                      type="url"
                      value={clientYoutube}
                      onChange={(e) => setClientYoutube(e.target.value)}
                      placeholder="https://youtube.com/@username"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid rgba(55, 53, 47, 0.16)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        background: "white",
                        color: "rgba(55, 53, 47, 0.85)"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(55, 53, 47, 0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      트위터 URL
                    </label>
                    <input
                      type="url"
                      value={clientTwitter}
                      onChange={(e) => setClientTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid rgba(55, 53, 47, 0.16)",
                        borderRadius: "6px",
                        fontSize: "13px",
                        background: "white",
                        color: "rgba(55, 53, 47, 0.85)"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 콘텐츠 블록 편집 또는 미리보기 */}
              {isEditingContent ? (
                <div className="portfolio-detail-blocks-edit">
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "rgba(55, 53, 47, 0.7)" }}>콘텐츠 편집</h3>
                    <button
                      onClick={() => setIsEditingContent(false)}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(55, 53, 47, 0.08)",
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "13px",
                        cursor: "pointer",
                        color: "rgba(55, 53, 47, 0.7)"
                      }}
                    >
                      미리보기
                    </button>
                  </div>
                  <BlockEditor blocks={contentBlocks} onChange={setContentBlocks} />
                </div>
              ) : (
                <>
                  {contentBlocks.length > 0 ? (
                    <div className="portfolio-detail-blocks">
                      {contentBlocks.map((block) => renderBlock(block))}
                    </div>
                  ) : (
                    <div
                      className="portfolio-detail-blocks"
                      onClick={() => setIsEditingContent(true)}
                      style={{
                      cursor: "pointer",
                      padding: "40px",
                      textAlign: "center",
                      color: "rgba(55, 53, 47, 0.4)",
                      border: "2px dashed rgba(55, 53, 47, 0.16)",
                      borderRadius: "4px"
                    }}
                  >
                    콘텐츠를 추가하려면 클릭하세요
                  </div>
                  )}
                  <button
                    onClick={() => setIsEditingContent(true)}
                    style={{
                      marginTop: "24px",
                      padding: "6px 12px",
                      background: "rgba(55, 53, 47, 0.08)",
                      color: "rgba(55, 53, 47, 0.7)",
                      border: "none",
                      borderRadius: "3px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    콘텐츠 편집
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadModal;

