import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding auditoriums...');
  
  // Check if they already exist


  const auditoriums = [
    {
      name: 'Main Auditorium',
      capacity: 1500,
      amenities: 'Projector, Sound System, AC, WiFi, Stage Lighting',
      images: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000'
    },
    {
      name: 'Tech Seminar Hall',
      capacity: 250,
      amenities: 'Smart Board, High-speed Internet, Microphone, Podium',
      images: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000'
    },
    {
      name: 'Mini Theatre',
      capacity: 100,
      amenities: 'Surround Sound, 4K Screen, Recliner Seats, Soundproof',
      images: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000'
    },
    {
      name: 'Open Air Amphitheatre',
      capacity: 3000,
      amenities: 'Large Stage, Flood Lights, Outdoor Seating, Backstage Green Rooms',
      images: 'https://images.unsplash.com/photo-1561489422-45dea0fa73c4?q=80&w=1000'
    },
    {
      name: 'Executive Boardroom',
      capacity: 30,
      amenities: 'Conference Table, Video Conferencing, Coffee Machine, Whiteboard',
      images: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000'
    },
    {
      name: 'Innovation Hub',
      capacity: 150,
      amenities: 'Movable Seating, Multiple Screens, Brainstorming Walls, Fast WiFi',
      images: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000'
    }
  ];

  for (const aud of auditoriums) {
    // Upsert to prevent duplicates if name exists
    await prisma.auditorium.upsert({
      where: { name: aud.name },
      update: aud,
      create: aud
    });
  }
  
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
