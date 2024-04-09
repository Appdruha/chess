import styles from './figure-box.module.css'
import { FigureNames } from '../../../../models/figure-names.ts'

interface FigureBoxProps {
  figureIconSrc: string
  figureName: FigureNames
  handleClick: (figureName: FigureNames) => void
}

export const FigureBox = ({ figureIconSrc, figureName, handleClick }: FigureBoxProps) => {
  return (
    <div className={styles.container} onClick={() => handleClick(figureName)}>
      <img src={figureIconSrc} alt={figureName} />
    </div>
  )
}