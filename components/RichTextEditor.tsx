"use client";

import { useState, useRef, useEffect } from "react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || "");
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // 에디터 내용 초기화 및 업데이트
  useEffect(() => {
    if (editorRef.current && !showHtml) {
      const currentHtml = editorRef.current.innerHTML;
      const newValue = value || "";

      if (!newValue || newValue === "<br>" || newValue === "<p><br></p>") {
        if (
          currentHtml &&
          currentHtml !== "<br>" &&
          currentHtml !== "<p><br></p>"
        ) {
          editorRef.current.innerHTML = "";
        }
      } else if (currentHtml !== newValue) {
        editorRef.current.innerHTML = newValue;

        // iframe을 contentEditable="false"로 설정하여 블록처럼 동작하게
        const wrappers = editorRef.current.querySelectorAll(".youtube-wrapper");
        wrappers.forEach((wrapper) => {
          (wrapper as HTMLElement).setAttribute("contenteditable", "false");
        });
      }
    }
  }, [value, showHtml]);

  // HTML 보기로 전환할 때 현재 에디터 내용 저장
  const handleShowHtml = () => {
    if (editorRef.current) {
      setHtmlValue(editorRef.current.innerHTML);
    }
    setShowHtml(true);
  };

  // 에디터 보기로 전환할 때 HTML을 에디터에 반영
  const handleShowEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlValue;
      onChange(htmlValue);
    }
    setShowHtml(false);
  };

  // 에디터 내용 변경 시
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;

      if (!html || html === "<br>" || html.trim() === "") {
        onChange("");
      } else {
        onChange(html);
      }
    }
  };

  // 포맷 명령 실행
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  // 폰트 크기 적용
  const applyFontSize = (size: string) => {
    execCommand("fontSize", size);
    setShowFontSizeMenu(false);
  };

  // 폰트 글꼴 적용
  const applyFontFamily = (font: string) => {
    execCommand("fontName", font);
    setShowFontFamilyMenu(false);
  };

  // 폰트 색상 적용
  const applyFontColor = (color: string) => {
    execCommand("foreColor", color);
  };

  // 배경색 적용
  const applyBackgroundColor = (color: string) => {
    execCommand("backColor", color);
  };

  // 배경색 제거
  const removeBackgroundColor = () => {
    execCommand("backColor", "transparent");
    setShowBgColorPicker(false);
  };

  // 이미지 삽입
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageLayout, setImageLayout] = useState<"single" | "grid2" | "grid3" | "grid4">("single");
  const [imageAlign, setImageAlign] = useState<"left" | "center" | "right">("center");
  const imageSavedRangeRef = useRef<Range | null>(null);

  const insertImage = () => {
    // 현재 커서 위치 저장
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        imageSavedRangeRef.current = range.cloneRange();
      }
    }
    setShowImageModal(true);
  };

  const handleInsertImages = async () => {
    if (!editorRef.current || imageFiles.length === 0) return;

    try {
      // 모든 이미지 업로드
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
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
        uploadedUrls.push(data.url);
      }

      // 에디터에 포커스
      editorRef.current.focus();

      // 저장된 range 사용
      const selection = window.getSelection();
      let range: Range | null = null;

      if (imageSavedRangeRef.current) {
        range = imageSavedRangeRef.current;
        try {
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (e) {
          if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          }
        }
      } else if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      // 정렬 스타일
      let alignStyle = "";
      if (imageAlign === "center") {
        alignStyle = "margin-left: auto; margin-right: auto;";
      } else if (imageAlign === "left") {
        alignStyle = "margin-right: auto;";
      } else if (imageAlign === "right") {
        alignStyle = "margin-left: auto;";
      }

      // 레이아웃에 따라 HTML 생성
      let imageHtml = "";
      if (imageLayout === "single" && uploadedUrls.length > 0) {
        imageHtml = `<div style="margin: 24px 0; ${alignStyle} display: block; max-width: 100%;"><img src="${uploadedUrls[0]}" style="max-width: 100%; height: auto; border-radius: 8px; display: block;" /></div>`;
      } else {
        // 그리드 레이아웃
        const cols = imageLayout === "grid2" ? 2 : imageLayout === "grid3" ? 3 : 4;
        imageHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 16px; margin: 24px 0; ${alignStyle} max-width: 100%;">`;
        uploadedUrls.forEach((url) => {
          imageHtml += `<div><img src="${url}" style="width: 100%; height: auto; border-radius: 8px; display: block;" /></div>`;
        });
        imageHtml += `</div>`;
      }

      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = imageHtml;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        range.insertNode(fragment);
      } else {
        editorRef.current.innerHTML += imageHtml;
      }

      onChange(editorRef.current.innerHTML);

      // 모달 닫기 및 초기화
      setShowImageModal(false);
      setImageFiles([]);
      setImageLayout("single");
      setImageAlign("center");
      imageSavedRangeRef.current = null;
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  // 링크 삽입/편집
  const insertLink = () => {
    const url = prompt("링크 URL을 입력하세요:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  // 표 삽입
  const insertTable = () => {
    if (!editorRef.current) return;

    let tableHTML = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid rgba(55, 53, 47, 0.16);">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        if (i === 0) {
          tableHTML += '<th style="border: 1px solid rgba(55, 53, 47, 0.16); padding: 8px; background: rgba(55, 53, 47, 0.05); font-weight: 600;">제목</th>';
        } else {
          tableHTML += '<td style="border: 1px solid rgba(55, 53, 47, 0.16); padding: 8px;">내용</td>';
        }
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table><p><br></p>';

    editorRef.current.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = tableHTML;
      const fragment = document.createDocumentFragment();
      
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      range.insertNode(fragment);
    } else {
      editorRef.current.innerHTML += tableHTML;
    }

    onChange(editorRef.current.innerHTML);
    setShowTableModal(false);
    setTableRows(3);
    setTableCols(3);
  };

  // 취소/재실행
  const undo = () => {
    execCommand("undo");
  };

  const redo = () => {
    execCommand("redo");
  };

  // 유튜브 삽입
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeSize, setYoutubeSize] = useState("100%");
  const [youtubeAlign, setYoutubeAlign] = useState("center");
  const savedRangeRef = useRef<Range | null>(null);

  // 유튜브 수정
  const [showYoutubeEditMenu, setShowYoutubeEditMenu] = useState(false);
  const [editingYoutubeId, setEditingYoutubeId] = useState<string | null>(null);
  const [editMenuPosition, setEditMenuPosition] = useState({ top: 0, left: 0 });

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const insertYouTube = () => {
    if (!editorRef.current) return;
    if (!youtubeUrl.trim()) {
      alert("유튜브 URL을 입력해주세요.");
      return;
    }

    const embedUrl = getYouTubeEmbedUrl(youtubeUrl.trim());

    // 정렬 스타일
    let alignStyle = "";
    if (youtubeAlign === "center") {
      alignStyle = "margin-left: auto; margin-right: auto;";
    } else if (youtubeAlign === "left") {
      alignStyle = "margin-right: auto;";
    } else if (youtubeAlign === "right") {
      alignStyle = "margin-left: auto;";
    }

    // 크기 계산
    let maxWidth = "560px";
    if (youtubeSize === "50%") {
      maxWidth = "280px";
    } else if (youtubeSize === "75%") {
      maxWidth = "420px";
    } else if (youtubeSize === "90%") {
      maxWidth = "504px";
    } else if (youtubeSize === "100%") {
      maxWidth = "100%";
    }

    // 고유 ID 생성
    const uniqueId = `youtube-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // contentEditable="false"로 설정하여 블록처럼 삭제 가능하게
    const iframeHtml = `<div class="youtube-wrapper" contenteditable="false" id="${uniqueId}" data-size="${youtubeSize}" data-align="${youtubeAlign}" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: ${maxWidth}; width: 100%; margin: 24px 0; ${alignStyle} display: block; border: 2px solid transparent; border-radius: 8px; transition: all 0.2s;"><div class="youtube-controls" style="position: absolute; top: 8px; right: 8px; z-index: 10; display: none; gap: 4px;"><button class="youtube-edit-btn" type="button" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(46, 170, 220, 0.9); border: 2px solid white; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 14px; font-weight: bold; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">✎</button><button class="youtube-delete-btn" type="button" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(235, 87, 87, 0.9); border: 2px solid white; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 20px; font-weight: bold; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">×</button></div><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

    // 에디터에 포커스
    editorRef.current.focus();

    // 저장된 range를 사용하거나 현재 selection을 사용
    const selection = window.getSelection();
    let range: Range | null = null;

    if (savedRangeRef.current) {
      // 저장된 range가 있으면 사용
      range = savedRangeRef.current;
      try {
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        // range가 유효하지 않으면 현재 selection 사용
        if (selection && selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        }
      }
    } else if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }

    if (range && editorRef.current.contains(range.commonAncestorContainer)) {
      range.deleteContents();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = iframeHtml;
      const fragment = document.createDocumentFragment();

      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      range.insertNode(fragment);

      // 삽입 후 커서를 유튜브 뒤로 이동
      const insertedElement = editorRef.current.querySelector(`#${uniqueId}`);
      if (insertedElement && selection) {
        const newRange = document.createRange();
        newRange.setStartAfter(insertedElement);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        // 빈 텍스트 노드 삽입 (커서 위치 확보)
        const textNode = document.createTextNode("\u00A0"); // non-breaking space
        newRange.insertNode(textNode);
        newRange.setStartAfter(textNode);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      // 커서가 없으면 끝에 추가
      editorRef.current.innerHTML += iframeHtml + "<p><br></p>";
    }

    onChange(editorRef.current.innerHTML);

    setShowYoutubeModal(false);
    setYoutubeUrl("");
    setYoutubeSize("100%");
    setYoutubeAlign("center");
    savedRangeRef.current = null;
  };

  // 유튜브 수정 적용
  const applyYoutubeEdit = (size: string, align: string) => {
    if (!editingYoutubeId || !editorRef.current) return;

    const wrapper = editorRef.current.querySelector(
      `#${editingYoutubeId}`
    ) as HTMLElement;
    if (!wrapper) return;

    // 크기 계산
    let maxWidth = "560px";
    if (size === "50%") maxWidth = "280px";
    else if (size === "75%") maxWidth = "420px";
    else if (size === "90%") maxWidth = "504px";
    else if (size === "100%") maxWidth = "100%";

    // 스타일 업데이트
    wrapper.style.maxWidth = maxWidth;
    wrapper.style.marginLeft =
      align === "center" || align === "right" ? "auto" : "0";
    wrapper.style.marginRight =
      align === "center" || align === "left" ? "auto" : "0";

    // data 속성 업데이트
    wrapper.setAttribute("data-size", size);
    wrapper.setAttribute("data-align", align);

    onChange(editorRef.current.innerHTML);
    setShowYoutubeEditMenu(false);
    setEditingYoutubeId(null);
  };

  // 유튜브 래퍼에 호버 효과 및 버튼 기능 추가
  useEffect(() => {
    if (!editorRef.current || showHtml) return;

    const handleWrapperEvents = (e: Event) => {
      const target = e.target as HTMLElement;
      const wrapper = target.closest(".youtube-wrapper") as HTMLElement;

      if (wrapper) {
        const controls = wrapper.querySelector(
          ".youtube-controls"
        ) as HTMLElement;

        if (e.type === "mouseenter") {
          wrapper.style.borderColor = "rgba(46, 170, 220, 0.5)";
          wrapper.style.boxShadow = "0 0 0 4px rgba(46, 170, 220, 0.1)";
          if (controls) controls.style.display = "flex";
        } else if (e.type === "mouseleave") {
          wrapper.style.borderColor = "transparent";
          wrapper.style.boxShadow = "none";
          if (controls) controls.style.display = "none";
        }
      }
    };

    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      e.preventDefault();
      e.stopPropagation();

      if (target.classList.contains("youtube-delete-btn")) {
        const wrapper = target.closest(".youtube-wrapper");
        if (wrapper) {
          wrapper.remove();
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }
      } else if (target.classList.contains("youtube-edit-btn")) {
        const wrapper = target.closest(".youtube-wrapper") as HTMLElement;
        if (wrapper) {
          const wrapperId = wrapper.id;
          const currentSize = wrapper.getAttribute("data-size") || "100%";
          const currentAlign = wrapper.getAttribute("data-align") || "center";

          setEditingYoutubeId(wrapperId);
          setYoutubeSize(currentSize);
          setYoutubeAlign(currentAlign);
          setShowYoutubeEditMenu(true);
        }
      }
    };

    const editor = editorRef.current;
    const wrappers = editor.querySelectorAll(".youtube-wrapper");

    wrappers.forEach((wrapper) => {
      wrapper.addEventListener("mouseenter", handleWrapperEvents);
      wrapper.addEventListener("mouseleave", handleWrapperEvents);
      wrapper.addEventListener("click", handleButtonClick);
    });

    return () => {
      wrappers.forEach((wrapper) => {
        wrapper.removeEventListener("mouseenter", handleWrapperEvents);
        wrapper.removeEventListener("mouseleave", handleWrapperEvents);
        wrapper.removeEventListener("click", handleButtonClick);
      });
    };
  }, [value, showHtml, onChange]);

  // 색상 팔레트
  const colors = [
    "#000000",
    "#424242",
    "#636363",
    "#9C9C94",
    "#CEC6CE",
    "#FF0000",
    "#FF9C00",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#0000FF",
    "#9C00FF",
    "#FF00FF",
    "#FF0084",
    "#F7F7F7",
    "#E6B8AF",
    "#F4CCCC",
    "#FCE5CD",
    "#FFF2CC",
    "#D9EAD3",
    "#D0E0E3",
    "#C9DAF8",
    "#CFE2F3",
    "#D9D2E9",
    "#EAD1DC",
  ];

  return (
    <div className="classic-editor-wrapper">
      {/* 표 삽입 모달 */}
      {showTableModal && (
        <div
          className="youtube-modal-overlay"
          onClick={() => setShowTableModal(false)}
        >
          <div className="youtube-modal" onClick={(e) => e.stopPropagation()}>
            <h3>표 삽입</h3>

            <div className="youtube-modal-field">
              <label>행 개수</label>
              <input
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                placeholder="3"
              />
            </div>

            <div className="youtube-modal-field">
              <label>열 개수</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                placeholder="3"
              />
            </div>

            <div className="youtube-modal-actions">
              <button
                className="youtube-modal-cancel"
                onClick={() => {
                  setShowTableModal(false);
                  setTableRows(3);
                  setTableCols(3);
                }}
              >
                취소
              </button>
              <button className="youtube-modal-confirm" onClick={insertTable}>
                삽입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 유튜브 수정 메뉴 (모달 스타일) */}
      {showYoutubeEditMenu && (
        <div
          className="youtube-modal-overlay"
          onClick={() => {
            setShowYoutubeEditMenu(false);
            setEditingYoutubeId(null);
          }}
        >
          <div className="youtube-modal" onClick={(e) => e.stopPropagation()}>
            <h3>유튜브 설정 변경</h3>

            <div className="youtube-modal-field">
              <label>크기</label>
              <div className="youtube-size-buttons">
                <button
                  className={youtubeSize === "50%" ? "active" : ""}
                  onClick={() => setYoutubeSize("50%")}
                >
                  소
                </button>
                <button
                  className={youtubeSize === "75%" ? "active" : ""}
                  onClick={() => setYoutubeSize("75%")}
                >
                  중
                </button>
                <button
                  className={youtubeSize === "90%" ? "active" : ""}
                  onClick={() => setYoutubeSize("90%")}
                >
                  대
                </button>
                <button
                  className={youtubeSize === "100%" ? "active" : ""}
                  onClick={() => setYoutubeSize("100%")}
                >
                  최대
                </button>
              </div>
            </div>

            <div className="youtube-modal-field">
              <label>정렬</label>
              <div className="youtube-align-buttons">
                <button
                  className={youtubeAlign === "left" ? "active" : ""}
                  onClick={() => setYoutubeAlign("left")}
                >
                  좌측
                </button>
                <button
                  className={youtubeAlign === "center" ? "active" : ""}
                  onClick={() => setYoutubeAlign("center")}
                >
                  중앙
                </button>
                <button
                  className={youtubeAlign === "right" ? "active" : ""}
                  onClick={() => setYoutubeAlign("right")}
                >
                  우측
                </button>
              </div>
            </div>

            <div className="youtube-modal-actions">
              <button
                className="youtube-modal-cancel"
                onClick={() => {
                  setShowYoutubeEditMenu(false);
                  setEditingYoutubeId(null);
                }}
              >
                취소
              </button>
              <button
                className="youtube-modal-confirm"
                onClick={() => applyYoutubeEdit(youtubeSize, youtubeAlign)}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 삽입 모달 */}
      {showImageModal && (
        <div
          className="youtube-modal-overlay"
          onClick={() => {
            setShowImageModal(false);
            setImageFiles([]);
          }}
        >
          <div className="youtube-modal" onClick={(e) => e.stopPropagation()}>
            <h3>이미지 삽입</h3>

            <div className="youtube-modal-field">
              <label>이미지 파일</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImageFiles(files);
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid rgba(55, 53, 47, 0.16)",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {imageFiles.length > 0 && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "rgba(55, 53, 47, 0.6)" }}>
                  {imageFiles.length}개 파일 선택됨
                </div>
              )}
            </div>

            <div className="youtube-modal-field">
              <label>레이아웃</label>
              <div className="youtube-size-buttons">
                <button
                  className={imageLayout === "single" ? "active" : ""}
                  onClick={() => setImageLayout("single")}
                >
                  단일
                </button>
                <button
                  className={imageLayout === "grid2" ? "active" : ""}
                  onClick={() => setImageLayout("grid2")}
                >
                  2열
                </button>
                <button
                  className={imageLayout === "grid3" ? "active" : ""}
                  onClick={() => setImageLayout("grid3")}
                >
                  3열
                </button>
                <button
                  className={imageLayout === "grid4" ? "active" : ""}
                  onClick={() => setImageLayout("grid4")}
                >
                  4열
                </button>
              </div>
            </div>

            <div className="youtube-modal-field">
              <label>정렬</label>
              <div className="youtube-align-buttons">
                <button
                  className={imageAlign === "left" ? "active" : ""}
                  onClick={() => setImageAlign("left")}
                >
                  좌측
                </button>
                <button
                  className={imageAlign === "center" ? "active" : ""}
                  onClick={() => setImageAlign("center")}
                >
                  중앙
                </button>
                <button
                  className={imageAlign === "right" ? "active" : ""}
                  onClick={() => setImageAlign("right")}
                >
                  우측
                </button>
              </div>
            </div>

            <div className="youtube-modal-actions">
              <button
                className="youtube-modal-cancel"
                onClick={() => {
                  setShowImageModal(false);
                  setImageFiles([]);
                }}
              >
                취소
              </button>
              <button
                className="youtube-modal-confirm"
                onClick={handleInsertImages}
                disabled={imageFiles.length === 0}
              >
                삽입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 유튜브 삽입 모달 */}
      {showYoutubeModal && (
        <div
          className="youtube-modal-overlay"
          onClick={() => {
            setShowYoutubeModal(false);
            setYoutubeUrl("");
          }}
        >
          <div className="youtube-modal" onClick={(e) => e.stopPropagation()}>
            <h3>유튜브 동영상 삽입</h3>

            <div className="youtube-modal-field">
              <label>유튜브 URL</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    insertYouTube();
                  }
                }}
              />
            </div>

            <div className="youtube-modal-field">
              <label>크기</label>
              <div className="youtube-size-buttons">
                <button
                  className={youtubeSize === "50%" ? "active" : ""}
                  onClick={() => setYoutubeSize("50%")}
                >
                  소
                </button>
                <button
                  className={youtubeSize === "75%" ? "active" : ""}
                  onClick={() => setYoutubeSize("75%")}
                >
                  중
                </button>
                <button
                  className={youtubeSize === "90%" ? "active" : ""}
                  onClick={() => setYoutubeSize("90%")}
                >
                  대
                </button>
                <button
                  className={youtubeSize === "100%" ? "active" : ""}
                  onClick={() => setYoutubeSize("100%")}
                >
                  최대
                </button>
              </div>
            </div>

            <div className="youtube-modal-field">
              <label>정렬</label>
              <div className="youtube-align-buttons">
                <button
                  className={youtubeAlign === "left" ? "active" : ""}
                  onClick={() => setYoutubeAlign("left")}
                >
                  좌측
                </button>
                <button
                  className={youtubeAlign === "center" ? "active" : ""}
                  onClick={() => setYoutubeAlign("center")}
                >
                  중앙
                </button>
                <button
                  className={youtubeAlign === "right" ? "active" : ""}
                  onClick={() => setYoutubeAlign("right")}
                >
                  우측
                </button>
              </div>
            </div>

            <div className="youtube-modal-actions">
              <button
                className="youtube-modal-cancel"
                onClick={() => {
                  setShowYoutubeModal(false);
                  setYoutubeUrl("");
                }}
              >
                취소
              </button>
              <button className="youtube-modal-confirm" onClick={insertYouTube}>
                삽입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 툴바 */}
      <div className="classic-editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={undo}
            title="취소"
            className="toolbar-btn"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={redo}
            title="재실행"
            className="toolbar-btn"
          >
            ↷
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            title="굵게"
            className="toolbar-btn"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            title="기울임"
            className="toolbar-btn"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            title="밑줄"
            className="toolbar-btn"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => execCommand("strikeThrough")}
            title="취소선"
            className="toolbar-btn"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h1")}
            title="제목 1"
            className="toolbar-btn"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h2")}
            title="제목 2"
            className="toolbar-btn"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h3")}
            title="제목 3"
            className="toolbar-btn"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "p")}
            title="본문"
            className="toolbar-btn"
          >
            P
          </button>
        </div>

        <div className="toolbar-group">
          <div className="toolbar-dropdown">
            <button
              type="button"
              onClick={() => setShowFontFamilyMenu(!showFontFamilyMenu)}
              title="글꼴"
              className="toolbar-btn"
            >
              글꼴
            </button>
            {showFontFamilyMenu && (
              <div className="toolbar-dropdown-menu font-family-menu">
                <button onClick={() => applyFontFamily("Arial")}>
                  <span style={{ fontFamily: "Arial" }}>Arial</span>
                </button>
                <button onClick={() => applyFontFamily("Times New Roman")}>
                  <span style={{ fontFamily: "Times New Roman" }}>
                    Times New Roman
                  </span>
                </button>
                <button onClick={() => applyFontFamily("Georgia")}>
                  <span style={{ fontFamily: "Georgia" }}>Georgia</span>
                </button>
                <button onClick={() => applyFontFamily("Courier New")}>
                  <span style={{ fontFamily: "Courier New" }}>Courier New</span>
                </button>
                <button onClick={() => applyFontFamily("Verdana")}>
                  <span style={{ fontFamily: "Verdana" }}>Verdana</span>
                </button>
                <button onClick={() => applyFontFamily("Trebuchet MS")}>
                  <span style={{ fontFamily: "Trebuchet MS" }}>
                    Trebuchet MS
                  </span>
                </button>
                <button onClick={() => applyFontFamily("Comic Sans MS")}>
                  <span style={{ fontFamily: "Comic Sans MS" }}>
                    Comic Sans MS
                  </span>
                </button>
                <button
                  onClick={() => applyFontFamily("맑은 고딕, Malgun Gothic")}
                >
                  <span style={{ fontFamily: "맑은 고딕, Malgun Gothic" }}>
                    맑은 고딕
                  </span>
                </button>
                <button
                  onClick={() => applyFontFamily("나눔고딕, Nanum Gothic")}
                >
                  <span style={{ fontFamily: "나눔고딕, Nanum Gothic" }}>
                    나눔고딕
                  </span>
                </button>
                <button onClick={() => applyFontFamily("돋움, Dotum")}>
                  <span style={{ fontFamily: "돋움, Dotum" }}>돋움</span>
                </button>
                <button onClick={() => applyFontFamily("바탕, Batang")}>
                  <span style={{ fontFamily: "바탕, Batang" }}>바탕</span>
                </button>
              </div>
            )}
          </div>

          <div className="toolbar-dropdown">
            <button
              type="button"
              onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
              title="글자 크기"
              className="toolbar-btn"
            >
              크기
            </button>
            {showFontSizeMenu && (
              <div className="toolbar-dropdown-menu">
                <button onClick={() => applyFontSize("1")}>매우 작게</button>
                <button onClick={() => applyFontSize("2")}>작게</button>
                <button onClick={() => applyFontSize("3")}>보통</button>
                <button onClick={() => applyFontSize("4")}>크게</button>
                <button onClick={() => applyFontSize("5")}>매우 크게</button>
                <button onClick={() => applyFontSize("6")}>특대</button>
                <button onClick={() => applyFontSize("7")}>최대</button>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-group">
          <div className="toolbar-dropdown">
            <button
              type="button"
              onClick={() => setShowFontColorPicker(!showFontColorPicker)}
              title="글자 색"
              className="toolbar-btn"
            >
              A
              <span
                className="color-indicator"
                style={{ background: "currentColor" }}
              ></span>
            </button>
            {showFontColorPicker && (
              <div className="color-picker-dropdown">
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="color-btn"
                      style={{ background: color }}
                      onClick={() => {
                        applyFontColor(color);
                        setShowFontColorPicker(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="toolbar-dropdown">
            <button
              type="button"
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              title="배경색"
              className="toolbar-btn"
            >
              배경
              <span
                className="color-indicator"
                style={{ background: "#ffff00" }}
              ></span>
            </button>
            {showBgColorPicker && (
              <div className="color-picker-dropdown">
                <button
                  onClick={removeBackgroundColor}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "8px",
                    background: "rgba(235, 87, 87, 0.1)",
                    color: "rgb(235, 87, 87)",
                    border: "1px solid rgba(235, 87, 87, 0.3)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  배경색 제거
                </button>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="color-btn"
                      style={{ background: color }}
                      onClick={() => {
                        applyBackgroundColor(color);
                        setShowBgColorPicker(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            title="왼쪽 정렬"
            className="toolbar-btn"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            title="가운데 정렬"
            className="toolbar-btn"
          >
            ⬌
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            title="오른쪽 정렬"
            className="toolbar-btn"
          >
            ➡
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            title="글머리 기호"
            className="toolbar-btn"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            title="번호 매기기"
            className="toolbar-btn"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => execCommand("indent")}
            title="들여쓰기"
            className="toolbar-btn"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => execCommand("outdent")}
            title="내어쓰기"
            className="toolbar-btn"
          >
            ←
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={insertLink}
            title="링크"
            className="toolbar-btn"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={insertImage}
            title="이미지"
            className="toolbar-btn"
          >
            🖼
          </button>
          <button
            type="button"
            onClick={() => {
              // 현재 커서 위치 저장
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0 && editorRef.current) {
                const range = selection.getRangeAt(0);
                if (editorRef.current.contains(range.commonAncestorContainer)) {
                  savedRangeRef.current = range.cloneRange();
                }
              }
              setShowYoutubeModal(true);
            }}
            title="유튜브"
            className="toolbar-btn"
          >
            ▶
          </button>
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            title="표"
            className="toolbar-btn"
          >
            ⊞
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => execCommand("removeFormat")}
            title="서식 제거"
            className="toolbar-btn"
          >
            ✕
          </button>
        </div>

        <div className="toolbar-group toolbar-group-right">
          <button
            type="button"
            onClick={showHtml ? handleShowEditor : handleShowHtml}
            className="toolbar-btn html-toggle"
          >
            {showHtml ? "에디터" : "HTML"}
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      {showHtml ? (
        <div className="html-view-container">
          <textarea
            value={htmlValue}
            onChange={(e) => setHtmlValue(e.target.value)}
            className="html-view-textarea"
            placeholder="HTML 코드를 입력하거나 수정하세요..."
          />
          <div className="html-preview-label">미리보기</div>
          <div
            className="html-preview"
            dangerouslySetInnerHTML={{ __html: htmlValue }}
          />
        </div>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="classic-editor"
          onInput={handleInput}
          onBlur={handleInput}
          suppressContentEditableWarning
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
