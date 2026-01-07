import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

interface ProjectRequestBody {
  title: string;
  category: string;
  image: string;
  tags?: string[];
  contentBlocks?: any[];
  clientName?: string;
  clientImage?: string;
  clientYoutube?: string;
  clientTwitter?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ProjectRequestBody = await request.json();
    const { title, category, image, tags, contentBlocks, clientName, clientImage, clientYoutube, clientTwitter } = body;

    const project = await prisma.project.create({
      data: {
        title,
        category,
        image,
        tags: tags || [],
        contentBlocks: contentBlocks || [],
        clientName: clientName || null,
        clientImage: clientImage || null,
        clientYoutube: clientYoutube || null,
        clientTwitter: clientTwitter || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

