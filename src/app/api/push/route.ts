import { NextResponse } from 'next/server';
import webPush from 'web-push';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, clientName, appointmentId } = body;

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:info@caravaggiostattooatelier.com';

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: 'Chiavi VAPID mancanti in .env.local' },
        { status: 500 }
      );
    }

    webPush.setVapidDetails(subject, publicKey, privateKey);

    const payload = JSON.stringify({
      title: "Caravaggio's Atelier • Check-out Serale",
      body: `Hai tatuato ${clientName || 'il cliente'} oggi? Tocca per confermare pagamento e % studio.`,
      appointmentId,
    });

    await webPush.sendNotification(subscription, payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Errore invio Web Push:', error);
    return NextResponse.json({ error: 'Impossibile inviare push' }, { status: 500 });
  }
}