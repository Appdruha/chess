import { Figure } from '../models/figures/Figure.ts'
import { Cell } from '../models/Cell.ts'

export type KingAttacker = {figure: Figure, intermCells: Cell[]} | null