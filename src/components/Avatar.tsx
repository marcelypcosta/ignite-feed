import type { ImgHTMLAttributes } from "react";
import styles from "./Avatar.module.css";

// Extend para usar propriedades ja definidas pelo proprio ts sem precisar definir na interface
interface IAvatar extends ImgHTMLAttributes<HTMLImageElement> {
  hasBorder?: boolean;
}
export function Avatar({ hasBorder, ...props }: IAvatar) {
  return (
    <img
      // Se existir a propriedade 'hasBorder' no component é porque deve ter
      className={hasBorder ? styles.avatarWithBorder : styles.avatar}
      {...props}
    />
  );
}
