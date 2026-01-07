"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import "./BlockEditor.css";

export interface ContentBlock {
  id: string;
  type: "text" | "image" | "youtube" | "video";
  content: string;
  width?: "small" | "medium" | "large" | "full";
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BlockEditor = ({ blocks, onChange }: BlockEditorProps) => {
  const [htmlContent, setHtmlContent] = useState("");

  // 블록을 HTML로 변환
  useEffect(() => {
    if (blocks.length === 0) {
      setHtmlContent("");
      return;
    }

    // text 타입 블록이 HTML을 포함하고 있으면 그대로 사용
    const textBlock = blocks.find((b) => b.type === "text");
    if (textBlock) {
      setHtmlContent(textBlock.content);
    } else {
      setHtmlContent("");
    }
  }, [blocks]);

  // HTML 변경 시 블록으로 변환
  const handleHtmlChange = (html: string) => {
    setHtmlContent(html);

    // 빈 내용이면 빈 배열
    if (!html || html.trim() === "" || html === "<p><br></p>") {
      onChange([]);
      return;
    }

    // HTML을 하나의 text 블록으로 저장
    onChange([
      {
        id: "html-content",
        type: "text",
        content: html,
      },
    ]);
  };

  return (
    <div className="block-editor">
      <RichTextEditor
        value={htmlContent}
        onChange={handleHtmlChange}
        placeholder="내용을 입력하세요..."
      />
    </div>
  );
};

export default BlockEditor;
