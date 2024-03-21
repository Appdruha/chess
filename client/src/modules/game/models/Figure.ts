import { Colors } from './Colors.ts'

export enum FigureNames {
  KING = "Король",
  KNIGHT = "Конь",
  PAWN = "Пешка",
  QUEEN = "Ферзь",
  ROOK = "Ладья",
  BISHOP = "Слон",
}

export type FigureColor = 'BLACK' | 'WHITE'

export class Figure {
  color: FigureColor;
  cell: Cell;
  name: FigureNames;
  id: number;


  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE
    this.id = Math.random()
  }

  canMove(target: Cell) : boolean {
    if(target.figure?.color === this.color)
      return false
    if(target.figure?.name === FigureNames.KING)
      return false
    return true;
  }

  moveFigure(target: Cell) {}
}