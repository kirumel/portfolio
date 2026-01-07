import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }> | {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { 
      title, 
      category, 
      image, 
      tags, 
      contentBlocks, 
      clientName, 
      clientImage, 
      clientYoutube, 
      clientTwitter,
      viewerBgColor,
      viewerAccentColor,
      viewerFontSize,
      viewerFontFamily,
      viewerTagBgColor,
      viewerTagTextColor,
      viewerHeroOverlayColor,
      viewerHeaderTextColor,
      viewerButtonBgColor,
      viewerButtonTextColor
    } = body;

    const updateData: any = {};
    
    if (contentBlocks !== undefined) {
      updateData.contentBlocks = contentBlocks;
    }
    if (title !== undefined) {
      updateData.title = title;
    }
    if (category !== undefined) {
      updateData.category = category;
    }
    if (image !== undefined) {
      updateData.image = image;
    }
    if (tags !== undefined) {
      updateData.tags = tags;
    }
    if (clientName !== undefined) {
      updateData.clientName = clientName;
    }
    if (clientImage !== undefined) {
      updateData.clientImage = clientImage;
    }
    if (clientYoutube !== undefined) {
      updateData.clientYoutube = clientYoutube;
    }
    if (clientTwitter !== undefined) {
      updateData.clientTwitter = clientTwitter;
    }
    if (viewerBgColor !== undefined) {
      updateData.viewerBgColor = viewerBgColor;
    }
    if (viewerAccentColor !== undefined) {
      updateData.viewerAccentColor = viewerAccentColor;
    }
    if (viewerFontSize !== undefined) {
      updateData.viewerFontSize = viewerFontSize;
    }
    if (viewerFontFamily !== undefined) {
      updateData.viewerFontFamily = viewerFontFamily;
    }
    if (viewerTagBgColor !== undefined) {
      updateData.viewerTagBgColor = viewerTagBgColor;
    }
    if (viewerTagTextColor !== undefined) {
      updateData.viewerTagTextColor = viewerTagTextColor;
    }
    if (viewerHeroOverlayColor !== undefined) {
      updateData.viewerHeroOverlayColor = viewerHeroOverlayColor;
    }
    if (viewerHeaderTextColor !== undefined) {
      updateData.viewerHeaderTextColor = viewerHeaderTextColor;
    }
    if (viewerButtonBgColor !== undefined) {
      updateData.viewerButtonBgColor = viewerButtonBgColor;
    }
    if (viewerButtonTextColor !== undefined) {
      updateData.viewerButtonTextColor = viewerButtonTextColor;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

