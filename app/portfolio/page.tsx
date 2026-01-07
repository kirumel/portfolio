"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";
import UploadModal from "@/components/UploadModal";
import PortfolioDetailModal from "@/components/PortfolioDetailModal";
import AboutCompact from "@/components/AboutCompact";
import "./portfolio.css";
import "@/app/globals.css";
import "@/app/styles.css";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NewProject {
  title: string;
  category: string;
  image: string;
  tags: string[];
  contentBlocks?: any[];
}

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data: Project[] = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/portfolio");
  };

  const handleUpload = async (newProject: NewProject) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        await fetchProjects();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Error uploading project:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const isLoggedIn = status === "authenticated" && !!session;

  if (loading) {
    return (
      <div className="portfolio-page">
        <Header />
        <div style={{ padding: "100px 0", textAlign: "center" }}>
          <p>로딩 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <Header />
      <AboutCompact />
      {isLoggedIn && (
        <div className="portfolio-header">
          <div className="container">
            <div className="portfolio-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                업로드
              </button>
              <button className="btn btn-secondary" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="portfolio-section">
        <div className="container">
          <PortfolioGrid
            projects={projects}
            isLoggedIn={isLoggedIn}
            onDelete={handleDelete}
            onProjectClick={setSelectedProjectId}
          />
        </div>
      </div>

      <Footer />

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {selectedProjectId && (
        <PortfolioDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}

