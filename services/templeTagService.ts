export interface TempleTag {
  id: number;
  name: string;
  slug: string;
}

export const fetchTempleTags = async (): Promise<TempleTag[]> => {
  const response = await fetch(
    `https://ujjaintirth.com/wp-json/wp/v2/temple_tag?per_page=50`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch temple tags");
  }

  return response.json();
};
