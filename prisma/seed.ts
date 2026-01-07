import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultProjects = [
    {
      title: "브랜드 프로모션 영상",
      category: "광고",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
      tags: ["Premiere Pro", "After Effects", "모션 그래픽"],
    },
    {
      title: "이벤트 하이라이트",
      category: "이벤트",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      tags: ["편집", "색보정", "사운드 디자인"],
    },
    {
      title: "음악 비디오",
      category: "뮤직 비디오",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      tags: ["Cinema 4D", "모션 그래픽", "색보정"],
    },
    {
      title: "기업 소개 영상",
      category: "기업",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
      tags: ["스토리보드", "편집", "나레이션"],
    },
    {
      title: "제품 런칭 영상",
      category: "제품",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      tags: ["3D 모델링", "애니메이션", "After Effects"],
    },
    {
      title: "다큐멘터리",
      category: "다큐",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
      tags: ["편집", "색보정", "음향"],
    },
  ];

  // 기존 프로젝트가 없을 때만 추가
  const existingProjects = await prisma.project.findMany();
  if (existingProjects.length === 0) {
    for (const project of defaultProjects) {
      await prisma.project.create({
        data: project,
      });
    }
    console.log("기본 프로젝트 데이터가 생성되었습니다.");
  } else {
    console.log("이미 프로젝트 데이터가 존재합니다.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
