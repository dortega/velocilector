import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Constantes para el almacenamiento
const BUCKET_NAME = 'player-avatars';
const FOLDER_PATH = 'avatars/';

export async function GET(request) {
  try {
    // Obtener parámetros de la URL
    const url = new URL(request.url);
    const gender = url.searchParams.get('gender') || 'male';
    const hairColor = url.searchParams.get('hairColor') || 'brown';
    const hairStyle = url.searchParams.get('hairStyle') || 'short';
    const skinTone = url.searchParams.get('skinTone') || 'medium';
    const eyeColor = url.searchParams.get('eyeColor') || 'brown';
    const age = parseInt(url.searchParams.get('age')) || 10; // Convertir a número
    
    console.log('Generating avatar with params:', { gender, hairColor, hairStyle, skinTone, eyeColor, age });
    
    // Mapear valores a descripciones más naturales
    const skinToneMap = {
      'very_light': 'very light',
      'light': 'light',
      'medium': 'medium',
      'tan': 'tan',
      'dark': 'dark',
      'very_dark': 'very dark'
    };
    
    const eyeColorMap = {
      'blue': 'bright blue',
      'green': 'vibrant green',
      'brown': 'warm brown',
      'hazel': 'hazel',
      'gray': 'steel gray',
      'amber': 'amber',
      'black': 'deep black'
    };
    
    const hairStyleDescription = hairStyle === 'short' ? 'short' : 
                               hairStyle === 'medium' ? 'medium-length' :
                               hairStyle === 'long' ? 'long flowing' :
                               hairStyle === 'ponytail' ? 'with a ponytail' :
                               hairStyle === 'pigtails' ? 'with pigtails' :
                               hairStyle === 'braid' ? 'with a braid' :
                               hairStyle === 'bald' ? 'bald' :
                               hairStyle === 'buzzcut' ? 'with a buzzcut' : '';
    
    const genderTerm = gender === 'male' ? 'boy' : 'girl';
    
    // Seleccionar estilo de ilustración según la edad
    let illustrationStyle;
    
    if (age <= 5) {
      // Para niños muy pequeños (3-5 años)
      illustrationStyle = "in a cute, simple cartoon style similar to Peppa Pig or Bluey, with rounded shapes and bright primary colors";
    } else if (age <= 8) {
      // Para niños pequeños (6-8 años)
      illustrationStyle = "in a playful cartoon style similar to Paw Patrol or SpongeBob SquarePants, with vibrant colors and expressive features";
    } else if (age <= 11) {
      // Para niños (9-11 años)
      illustrationStyle = "in a modern animation style similar to The Owl House or Gravity Falls, with detailed features and a colorful palette";
    } else if (age <= 14) {
      // Para preadolescentes (12-14 años)
      illustrationStyle = "in a contemporary animation style similar to Steven Universe or Avatar: The Last Airbender, with more defined features and a balanced color palette";
    } else {
      // Para adolescentes (15+ años)
      illustrationStyle = "in a teen-oriented animation style similar to The Dragon Prince or Arcane, with more realistic proportions while maintaining a stylized look";
    }
    
    // Instrucciones específicas para evitar múltiples personajes
    const specificInstructions = "The image must show ONLY ONE character, centered in the frame. Head and shoulders portrait only. Simple colorful background. The character must be facing forward with clear facial features.";
    
    // Generar el prompt para la imagen con instrucciones mejoradas
    const prompt = `A single portrait of an individual person ${genderTerm} who is ${age} years old with ${hairColor} hair ${hairStyleDescription}, ${eyeColorMap[eyeColor] || eyeColor} eyes, and ${skinToneMap[skinTone] || skinTone} skin, with a happy and friendly expression, ${illustrationStyle}. ${specificInstructions}`;
    
    console.log('Generated prompt:', prompt);
    
    // Generar la imagen con DALL-E
    console.log('Generating image with DALL-E...');
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });
    
    const imageUrl = response.data[0].url;
    console.log('Image generated:', imageUrl);
    
    // Descargar la imagen
    console.log('Downloading image...');
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Generar un nombre de archivo único con la ruta de la carpeta
    const fileName = `${FOLDER_PATH}avatar_${Date.now()}.png`;
    
    console.log(`Uploading to Supabase Storage bucket '${BUCKET_NAME}', path: '${fileName}'...`);
    
    // Subir la imagen a Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    // Obtener la URL pública
    const { data: { publicUrl } } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    console.log('Avatar created successfully:', publicUrl);
    
    // Devolver la URL de la imagen
    return NextResponse.json({ 
      avatarUrl: publicUrl,
      prompt: prompt
    });
    
  } catch (error) {
    console.error('Error generating avatar:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 