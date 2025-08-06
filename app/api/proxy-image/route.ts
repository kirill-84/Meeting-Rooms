import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Получаем параметр и проверяем его наличие
    const urlParam = request.nextUrl.searchParams.get('url');
    if (!urlParam) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Декодируем URL
    const decodedUrl = decodeURIComponent(urlParam);

    // Ограничиваем домены только Telegram
    const allowedPrefixes = [
      'https://t.me/',
      'https://cdn.telegram.org/',
      'https://telegram.org/',
    ];
    if (!allowedPrefixes.some((prefix) => decodedUrl.startsWith(prefix))) {
      return NextResponse.json(
        { error: 'Only Telegram URLs are allowed' },
        { status: 403 }
      );
    }

    // Фетчим картинку
    const imageResponse = await fetch(decodedUrl, {
      headers: {
        // Иногда нужно «прикинуться» браузером
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }

    // Читаем данные и тип контента
    const arrayBuffer = await imageResponse.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const contentType =
      imageResponse.headers.get('content-type') ?? 'image/jpeg';

    // Отдаём картинку клиенту
    return new NextResponse(uint8, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 24 часа
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
