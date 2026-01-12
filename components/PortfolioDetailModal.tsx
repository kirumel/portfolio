"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import BlockEditor, { ContentBlock } from "./BlockEditor";
import "./PortfolioDetailModal.css";

// JavaScript 실행을 위한 컴포넌트
const TextBlockWithScripts = ({ content }: { content: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // script 태그를 찾아서 실행
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="portfolio-detail-block portfolio-detail-block-text"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressContentEditableWarning
    />
  );
};

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
  contentBlocks?: ContentBlock[] | null;
  clientName?: string | null;
  clientImage?: string | null;
  clientYoutube?: string | null;
  clientTwitter?: string | null;
  viewerBgColor?: string | null;
  viewerAccentColor?: string | null;
  viewerFontSize?: string | null;
  viewerFontFamily?: string | null;
  viewerTagBgColor?: string | null;
  viewerTagTextColor?: string | null;
  viewerHeroOverlayColor?: string | null;
  viewerHeaderTextColor?: string | null;
  viewerButtonBgColor?: string | null;
  viewerButtonTextColor?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PortfolioDetailModalProps {
  projectId: number | null;
  onClose: () => void;
}

const PortfolioDetailModal = ({
  projectId,
  onClose,
}: PortfolioDetailModalProps) => {
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // 편집 데이터를 하나의 객체로 통합
  const [editedData, setEditedData] = useState({
    blocks: [] as ContentBlock[],
    title: "",
    category: "",
    tags: [] as string[],
    image: "",
    clientName: "",
    clientImage: "",
    clientYoutube: "",
    clientTwitter: "",
  });

  // 뷰어 스타일을 하나의 객체로 통합
  const [viewerStyle, setViewerStyle] = useState({
    bgColor: "#ffffff",
    accentColor: "#2eaadc",
    fontSize: "18px",
    fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
    tagBgColor: "#f0f0f0",
    tagTextColor: "#555555",
    heroOverlayColor: "rgba(0, 0, 0, 0.9)",
    headerTextColor: "rgba(55, 53, 47, 0.85)",
    buttonBgColor: "rgba(55, 53, 47, 0.08)",
    buttonTextColor: "rgba(55, 53, 47, 0.8)",
  });

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (project) {
      setEditedData({
        blocks: project.contentBlocks || [],
        title: project.title,
        category: project.category,
        tags: project.tags || [],
        image: project.image,
        clientName: project.clientName || "",
        clientImage: project.clientImage || "",
        clientYoutube: project.clientYoutube || "",
        clientTwitter: project.clientTwitter || "",
      });

      setViewerStyle({
        bgColor: project.viewerBgColor || "#ffffff",
        accentColor: project.viewerAccentColor || "#2eaadc",
        fontSize: project.viewerFontSize || "18px",
        fontFamily:
          project.viewerFontFamily ||
          "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
        tagBgColor: project.viewerTagBgColor || "#f0f0f0",
        tagTextColor: project.viewerTagTextColor || "#555555",
        heroOverlayColor:
          project.viewerHeroOverlayColor || "rgba(0, 0, 0, 0.9)",
        headerTextColor:
          project.viewerHeaderTextColor || "rgba(55, 53, 47, 0.85)",
        buttonBgColor: project.viewerButtonBgColor || "rgba(55, 53, 47, 0.08)",
        buttonTextColor:
          project.viewerButtonTextColor || "rgba(55, 53, 47, 0.8)",
      });
    }
  }, [project]);

  useEffect(() => {
    if (projectId) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [projectId]);

  if (!projectId) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // YouTube URL을 embed 형식으로 변환
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedData.title,
          category: editedData.category,
          image: editedData.image,
          tags: editedData.tags,
          contentBlocks: editedData.blocks,
          clientName: editedData.clientName,
          clientImage: editedData.clientImage,
          clientYoutube: editedData.clientYoutube,
          clientTwitter: editedData.clientTwitter,
          viewerBgColor: viewerStyle.bgColor,
          viewerAccentColor: viewerStyle.accentColor,
          viewerFontSize: viewerStyle.fontSize,
          viewerFontFamily: viewerStyle.fontFamily,
          viewerTagBgColor: viewerStyle.tagBgColor,
          viewerTagTextColor: viewerStyle.tagTextColor,
          viewerHeroOverlayColor: viewerStyle.heroOverlayColor,
          viewerHeaderTextColor: viewerStyle.headerTextColor,
          viewerButtonBgColor: viewerStyle.buttonBgColor,
          viewerButtonTextColor: viewerStyle.buttonTextColor,
        }),
      });

      if (response.ok) {
        await fetchProject();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const isLoggedIn = status === "authenticated" && session;

  return (
    <div className="portfolio-detail-overlay" onClick={handleOverlayClick}>
      <div className="portfolio-detail-modal">
        {loading ? (
          <div className="portfolio-detail-loading">
            <p>로딩 중...</p>
          </div>
        ) : project ? (
          <>
            {/* 상단 고정 헤더 */}
            <div
              className="portfolio-detail-header-bar"
              style={{
                background: viewerStyle.bgColor,
                color: viewerStyle.headerTextColor,
              }}
            >
              <div className="portfolio-detail-header-left">
                <div
                  className="portfolio-detail-header-title"
                  style={{ color: viewerStyle.headerTextColor }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.title}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="제목"
                      className="portfolio-detail-header-title-input"
                    />
                  ) : (
                    <span>{project.title}</span>
                  )}
                </div>

                {/* 태그 표시 */}
                <div className="portfolio-detail-header-tags">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.tags.join(", ")}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditedData((prev) => ({
                          ...prev,
                          tags: value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        }));
                      }}
                      placeholder="태그 (쉼표로 구분)"
                      className="portfolio-detail-header-tags-input"
                      style={{
                        background: viewerStyle.buttonBgColor,
                        color: viewerStyle.buttonTextColor,
                        borderColor: viewerStyle.buttonBgColor,
                      }}
                    />
                  ) : (
                    project.tags &&
                    project.tags.length > 0 && (
                      <>
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="portfolio-detail-header-tag"
                            style={{
                              backgroundColor: viewerStyle.tagBgColor,
                              color: viewerStyle.tagTextColor,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </>
                    )
                  )}
                </div>
              </div>

              <div className="portfolio-detail-actions">
                {isLoggedIn && (
                  <>
                    {isEditing ? (
                      <>
                        <button
                          className="portfolio-detail-save-btn"
                          onClick={handleSave}
                          disabled={saving}
                          style={{
                            background: viewerStyle.buttonBgColor,
                            color: viewerStyle.buttonTextColor,
                          }}
                        >
                          {saving ? "저장 중..." : "저장"}
                        </button>
                        <button
                          className="portfolio-detail-cancel-btn"
                          onClick={() => {
                            setIsEditing(false);
                            if (project) {
                              setEditedData({
                                blocks: project.contentBlocks || [],
                                title: project.title,
                                category: project.category,
                                tags: project.tags || [],
                                image: project.image,
                                clientName: project.clientName || "",
                                clientImage: project.clientImage || "",
                                clientYoutube: project.clientYoutube || "",
                                clientTwitter: project.clientTwitter || "",
                              });
                            }
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        className="portfolio-detail-edit-btn"
                        onClick={() => setIsEditing(true)}
                        style={{
                          background: viewerStyle.buttonBgColor,
                          color: viewerStyle.buttonTextColor,
                        }}
                      >
                        편집
                      </button>
                    )}
                  </>
                )}
                <button
                  className="portfolio-detail-close"
                  onClick={onClose}
                  style={{ color: viewerStyle.headerTextColor }}
                >
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
            </div>

            <div className="portfolio-detail-content">
              {/* 헤더 이미지 with 오버레이 - 전체 너비 */}
              <div className="portfolio-detail-header">
                <div className="portfolio-detail-image-wrapper">
                  <Image
                    src={editedData.image || project.image}
                    alt={editedData.title || project.title}
                    fill
                    priority
                  />
                  {/* 이미지 위 오버레이 정보 - 뷰어와 에디터 동일 */}
                  <div className="portfolio-detail-hero-overlay">
                    <div className="portfolio-detail-hero-meta">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.category}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          placeholder="카테고리"
                          className="portfolio-detail-hero-category-input"
                        />
                      ) : (
                        <span className="portfolio-detail-hero-category">
                          {project.category}
                        </span>
                      )}
                      <span className="portfolio-detail-hero-date">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.title}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="제목"
                        className="portfolio-detail-hero-title-input"
                      />
                    ) : (
                      <h1 className="portfolio-detail-hero-title">
                        {project.title}
                      </h1>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <div
                    style={{
                      padding: "12px 56px",
                      background: viewerStyle.bgColor,
                    }}
                  >
                    <input
                      type="text"
                      value={editedData.image}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      placeholder="썸네일 이미지 URL"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid rgba(55, 53, 47, 0.16)",
                        borderRadius: "4px",
                        fontSize: "13px",
                        background: "transparent",
                        color: viewerStyle.buttonTextColor,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 메인 콘텐츠 */}
              <div
                className="portfolio-detail-main"
                style={
                  {
                    background: viewerStyle.bgColor,
                    fontSize: viewerStyle.fontSize,
                    fontFamily: viewerStyle.fontFamily,
                    "--accent-color": viewerStyle.accentColor,
                    "--base-font-size": viewerStyle.fontSize,
                  } as React.CSSProperties
                }
              >
                {/* 콘텐츠 블록 렌더링 또는 편집 */}
                {isEditing ? (
                  <>
                    {/* 뷰어 스타일 설정 */}
                    <details className="viewer-style-settings" open>
                      <summary
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: viewerStyle.buttonTextColor,
                          marginBottom: "16px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        🎨 뷰어 스타일 설정
                      </summary>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                          marginBottom: "32px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            배경색
                          </label>
                          <input
                            type="color"
                            value={viewerStyle.bgColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                bgColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            강조색
                          </label>
                          <input
                            type="color"
                            value={viewerStyle.accentColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                accentColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            글자 크기
                          </label>
                          <select
                            value={viewerStyle.fontSize}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                fontSize: e.target.value,
                              }))
                            }
                            style={{
                              padding: "8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          >
                            <option value="14px">작게 (14px)</option>
                            <option value="16px">보통 (16px)</option>
                            <option value="18px">기본 (18px)</option>
                            <option value="20px">크게 (20px)</option>
                            <option value="22px">매우 크게 (22px)</option>
                          </select>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            폰트
                          </label>
                          <select
                            value={viewerStyle.fontFamily}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                fontFamily: e.target.value,
                              }))
                            }
                            style={{
                              padding: "8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          >
                            <option value="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif">
                              Serif
                            </option>
                            <option value="ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                              Sans Serif
                            </option>
                            <option value="ui-monospace, 'Courier New', monospace">
                              Monospace
                            </option>
                            <option value="'Noto Serif KR', serif">
                              Noto Serif KR
                            </option>
                            <option value="'Nanum Gothic', sans-serif">
                              나눔고딕
                            </option>
                            <option value="'Nanum Myeongjo', serif">
                              나눔명조
                            </option>
                          </select>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            헤더 텍스트 색상
                          </label>
                          <input
                            type="color"
                            value={
                              viewerStyle.headerTextColor.startsWith("rgba")
                                ? "#37352f"
                                : viewerStyle.headerTextColor
                            }
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                headerTextColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            value={viewerStyle.headerTextColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                headerTextColor: e.target.value,
                              }))
                            }
                            placeholder="rgba(55, 53, 47, 0.85)"
                            style={{
                              padding: "6px 8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "11px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            태그 배경색
                          </label>
                          <input
                            type="color"
                            value={viewerStyle.tagBgColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                tagBgColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            태그 텍스트 색상
                          </label>
                          <input
                            type="color"
                            value={viewerStyle.tagTextColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                tagTextColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            버튼 배경색
                          </label>
                          <input
                            type="color"
                            value={
                              viewerStyle.buttonBgColor.startsWith("rgba")
                                ? "#f0f0f0"
                                : viewerStyle.buttonBgColor
                            }
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                buttonBgColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            value={viewerStyle.buttonBgColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                buttonBgColor: e.target.value,
                              }))
                            }
                            placeholder="rgba(55, 53, 47, 0.08)"
                            style={{
                              padding: "6px 8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "11px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            버튼 텍스트 색상
                          </label>
                          <input
                            type="color"
                            value={
                              viewerStyle.buttonTextColor.startsWith("rgba")
                                ? "#37352f"
                                : viewerStyle.buttonTextColor
                            }
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                buttonTextColor: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: "36px",
                              cursor: "pointer",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            value={viewerStyle.buttonTextColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                buttonTextColor: e.target.value,
                              }))
                            }
                            placeholder="rgba(55, 53, 47, 0.8)"
                            style={{
                              padding: "6px 8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "11px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: viewerStyle.buttonTextColor,
                              opacity: 0.7,
                            }}
                          >
                            이미지 오버레이 색상
                          </label>
                          <input
                            type="text"
                            value={viewerStyle.heroOverlayColor}
                            onChange={(e) =>
                              setViewerStyle((prev) => ({
                                ...prev,
                                heroOverlayColor: e.target.value,
                              }))
                            }
                            placeholder="rgba(0, 0, 0, 0.9)"
                            style={{
                              padding: "6px 8px",
                              border: "1px solid rgba(55, 53, 47, 0.16)",
                              borderRadius: "4px",
                              fontSize: "11px",
                              background: "white",
                              color: "rgba(55, 53, 47, 0.85)",
                            }}
                          />
                        </div>
                      </div>
                    </details>

                    {/* 클라이언트 정보 편집 */}
                    <details
                      className="client-info-settings"
                      style={{ marginBottom: "32px" }}
                    >
                      <summary
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: viewerStyle.buttonTextColor,
                          marginBottom: "16px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        👤 클라이언트 정보
                      </summary>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <input
                          type="text"
                          value={editedData.clientImage}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              clientImage: e.target.value,
                            }))
                          }
                          placeholder="클라이언트 이미지 URL"
                          style={{
                            padding: "10px 12px",
                            border: "1px solid rgba(55, 53, 47, 0.16)",
                            borderRadius: "4px",
                            fontSize: "13px",
                            background: "white",
                            color: "rgba(55, 53, 47, 0.85)",
                          }}
                        />
                        <input
                          type="text"
                          value={editedData.clientName}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              clientName: e.target.value,
                            }))
                          }
                          placeholder="클라이언트 이름"
                          style={{
                            padding: "10px 12px",
                            border: "1px solid rgba(55, 53, 47, 0.16)",
                            borderRadius: "4px",
                            fontSize: "13px",
                            background: "white",
                            color: "rgba(55, 53, 47, 0.85)",
                          }}
                        />
                        <input
                          type="text"
                          value={editedData.clientYoutube}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              clientYoutube: e.target.value,
                            }))
                          }
                          placeholder="유튜브 URL"
                          style={{
                            padding: "10px 12px",
                            border: "1px solid rgba(55, 53, 47, 0.16)",
                            borderRadius: "4px",
                            fontSize: "13px",
                            background: "white",
                            color: "rgba(55, 53, 47, 0.85)",
                          }}
                        />
                        <input
                          type="text"
                          value={editedData.clientTwitter}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              clientTwitter: e.target.value,
                            }))
                          }
                          placeholder="트위터 URL"
                          style={{
                            padding: "10px 12px",
                            border: "1px solid rgba(55, 53, 47, 0.16)",
                            borderRadius: "4px",
                            fontSize: "13px",
                            background: "white",
                            color: "rgba(55, 53, 47, 0.85)",
                          }}
                        />
                      </div>
                    </details>

                    <div className="portfolio-detail-blocks-edit">
                      <style>
                        {`
                           .classic-editor-wrapper {
                             background: ${viewerStyle.bgColor} !important;
                             border-color: ${viewerStyle.buttonBgColor} !important;
                           }
                           .classic-editor-toolbar {
                             background: ${viewerStyle.buttonBgColor} !important;
                             border-bottom-color: ${viewerStyle.buttonBgColor} !important;
                           }
                           .toolbar-btn {
                             color: ${viewerStyle.buttonTextColor} !important;
                             background: transparent !important;
                           }
                           .toolbar-btn:hover {
                             background: ${viewerStyle.buttonBgColor} !important;
                           }
                           .classic-editor {
                             background: ${viewerStyle.bgColor} !important;
                             color: ${viewerStyle.buttonTextColor} !important;
                             font-family: ${viewerStyle.fontFamily} !important;
                             font-size: ${viewerStyle.fontSize} !important;
                           }
                           .classic-editor:empty:before {
                             color: ${viewerStyle.buttonTextColor}80 !important;
                           }
                           .toolbar-dropdown-menu {
                             background: ${viewerStyle.bgColor} !important;
                             border-color: ${viewerStyle.buttonBgColor} !important;
                           }
                           .toolbar-dropdown-menu button {
                             color: ${viewerStyle.buttonTextColor} !important;
                           }
                           .toolbar-dropdown-menu button:hover {
                             background: ${viewerStyle.buttonBgColor} !important;
                           }
                           .youtube-modal {
                             background: ${viewerStyle.bgColor} !important;
                           }
                           .youtube-modal h3,
                           .youtube-modal-field label {
                             color: ${viewerStyle.buttonTextColor} !important;
                           }
                           .youtube-modal-field input,
                           .youtube-size-buttons button,
                           .youtube-align-buttons button {
                             background: ${viewerStyle.bgColor} !important;
                             color: ${viewerStyle.buttonTextColor} !important;
                             border-color: ${viewerStyle.buttonBgColor} !important;
                           }
                           .youtube-modal-field input:focus,
                           .youtube-size-buttons button:hover,
                           .youtube-align-buttons button:hover {
                             background: ${viewerStyle.buttonBgColor} !important;
                           }
                         `}
                      </style>
                      <BlockEditor
                        blocks={editedData.blocks}
                        onChange={(blocks) =>
                          setEditedData((prev) => ({ ...prev, blocks }))
                        }
                      />
                    </div>
                  </>
                ) : (
                  project.contentBlocks &&
                  project.contentBlocks.length > 0 && (
                    <div
                      className="portfolio-detail-blocks"
                      style={{
                        fontSize: viewerStyle.fontSize,
                        fontFamily: viewerStyle.fontFamily,
                      }}
                    >
                      {project.contentBlocks.map((block) => {
                        switch (block.type) {
                          case "text":
                            return (
                              <TextBlockWithScripts
                                key={block.id}
                                content={block.content}
                              />
                            );

                          case "image":
                            return (
                              <div
                                key={block.id}
                                className="portfolio-detail-block portfolio-detail-block-image"
                              >
                                <div className="portfolio-detail-image-block">
                                  <Image
                                    src={block.content}
                                    alt={project.title}
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
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="portfolio-detail-error">
            <p>프로젝트를 불러올 수 없습니다.</p>
            <button onClick={onClose}>닫기</button>
          </div>
        )}
      </div>

      {/* 오른쪽 클라이언트 정보 패널 - 뷰어 모드에서만 표시 */}
      {project && !isEditing && (
        <div className="portfolio-side-panel portfolio-side-panel-right">
          <h3 className="side-panel-title">client</h3>
          <>
            {/* AboutCompact 스타일 - 프로필 */}
            {(project.clientImage || project.clientName) && (
              <div className="side-panel-profile-section">
                <div className="side-panel-profile-main">
                  {project.clientImage && (
                    <div className="side-panel-client-image">
                      <Image
                        src={project.clientImage}
                        alt={project.clientName || "클라이언트"}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                    </div>
                  )}
                  {project.clientName && (
                    <div className="side-panel-client-info">
                      <div className="side-panel-client-name">
                        {project.clientName}
                      </div>
                      <div className="side-panel-client-role">Client</div>
                    </div>
                  )}
                  {/* 소셜 링크 - 같은 줄에 배치 */}
                  {(project.clientYoutube || project.clientTwitter) && (
                    <div className="side-panel-links">
                      {project.clientYoutube && (
                        <a
                          href={project.clientYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="side-panel-link side-panel-link-youtube"
                          title="YouTube"
                          aria-label="YouTube"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      )}

                      {project.clientTwitter && (
                        <a
                          href={project.clientTwitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="side-panel-link side-panel-link-twitter"
                          title="Twitter"
                          aria-label="Twitter"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!project.clientName &&
              !project.clientImage &&
              !project.clientYoutube &&
              !project.clientTwitter && (
                <div className="side-panel-empty">
                  클라이언트 정보가 없습니다.
                </div>
              )}
          </>
        </div>
      )}
    </div>
  );
};

export default PortfolioDetailModal;
