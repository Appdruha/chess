import styles from './choose-figure.module.css'
import { FigureBox } from './components/figure-box/Figure-box.tsx'
import { FigureNames } from '../../models/figure-names.ts'
import { ColorNames } from '../game/types/ColorNames.ts'
import { Message } from '../../types/Message.ts'
import { Dispatch, SetStateAction } from 'react'
import wB from '/alpha/wB.png'
import bB from '/alpha/bB.png'
import wQ from '/alpha/wQ.png'
import bQ from '/alpha/bQ.png'
import wN from '/alpha/wN.png'
import bN from '/alpha/bN.png'
import wR from '/alpha/wR.png'
import bR from '/alpha/bR.png'

interface ChooseFigureProps {
  playerColor: ColorNames | undefined
  webSocket: WebSocket
  setIsModalOpen:  Dispatch<SetStateAction<boolean>>
  changeFigurePosition: { from: string, to: string } | null
  roomId: string | undefined
}

export const ChooseFigure = ({
                               playerColor,
                               webSocket,
                               setIsModalOpen,
                               changeFigurePosition,
                               roomId,
                             }: ChooseFigureProps) => {
  const handleClick = (figureName: FigureNames) => {
    setIsModalOpen(false)
    if (!changeFigurePosition || !roomId || !playerColor) {
      throw new Error('ChooseFigure Error')
    }
    console.log(figureName)
    const message: Message = {
      type: 'changeFigure',
      params: {
        from: changeFigurePosition.from,
        to: changeFigurePosition.to,
        figureName,
        figureColor: playerColor,
      },
      roomId: roomId,
    }
    webSocket.send(JSON.stringify(message))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Выберите фигуру</h2>
      <div className={styles.figuresBlock}>
        <FigureBox handleClick={handleClick} figureIconSrc={playerColor === 'WHITE' ? wQ : bQ}
                   figureName={FigureNames.QUEEN} />
        <FigureBox handleClick={handleClick} figureIconSrc={playerColor === 'WHITE' ? wR : bR}
                   figureName={FigureNames.ROOK} />
        <FigureBox handleClick={handleClick} figureIconSrc={playerColor === 'WHITE' ? wN : bN}
                   figureName={FigureNames.KNIGHT} />
        <FigureBox handleClick={handleClick} figureIconSrc={playerColor === 'WHITE' ? wB : bB}
                   figureName={FigureNames.BISHOP} />
      </div>
    </div>
  )
}