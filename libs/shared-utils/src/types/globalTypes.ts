type ImageType = {
  width: number;
  height: number;
  alt: string;
  src: string;
};

type TextType = {
  content: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  fontColor?: string;
};

type NavLinkType = {
  text: string;
  href: string;
};

export type { ImageType, TextType, NavLinkType };
