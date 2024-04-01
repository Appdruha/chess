export class Player {
  color: 'WHITE' | 'BLACK'
  isCheck: boolean

  constructor(color: 'WHITE' | 'BLACK') {
    this.color = color
    this.isCheck = false
  }
}