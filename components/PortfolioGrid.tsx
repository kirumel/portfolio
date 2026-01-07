"use client";

import Image from "next/image";
import "./PortfolioGrid.css";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  tags?: string[];
}

interface PortfolioGridProps {
  projects: Project[];
  isLoggedIn: boolean;
  onDelete: (id: number) => void;
  onProjectClick?: (id: number) => void;
}

const PortfolioGrid = ({ projects, isLoggedIn, onDelete, onProjectClick }: PortfolioGridProps) => {
  const handleClick = (e: React.MouseEvent, projectId: number) => {
    // 삭제 버튼 클릭 시에는 모달을 열지 않음
    if ((e.target as HTMLElement).closest('.delete-btn')) {
      return;
    }
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  };

  return (
    <div className="portfolio-grid">
      {projects.map((project) => (
        <div
          key={project.id}
          className="portfolio-item"
          onClick={(e) => handleClick(e, project.id)}
        >
          <div className="portfolio-image-wrapper">
            <div className="portfolio-image">
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="portfolio-overlay">
              <div className="portfolio-tags">
                {project.tags &&
                  project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      {tag}
                    </span>
                  ))}
              </div>
              <h3 className="portfolio-title">
                {project.title}
              </h3>
            </div>
          </div>
          {isLoggedIn && (
            <button 
              className="delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;

