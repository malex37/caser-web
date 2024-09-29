function Generate(width: number, height: number) {

  // let's just make it red for now
  const color = '255';
  // RGB = 1920 (width) x 1080 (height) x 4 (channels [RGBA]);
  const channelCount = width * height * 4;
  const image: string[] = [];
  for (let i = 0; i < channelCount; i += 3) {
    image[i] = color;
    image[i + 1] = '0';
    image[i + 2] = '0';
    image[i + 3] = '255';
  }
  const file = new File(image, 'sample.png', {})
}
