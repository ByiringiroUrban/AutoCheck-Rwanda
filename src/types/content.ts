export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavDropdown {
  label: string;
  items: NavLink[];
}

export interface BenefitCard {
  eyebrow: string;
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  body: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface PartnerLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}
