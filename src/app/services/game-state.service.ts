import { Injectable } from '@angular/core';
import { Chess, Move } from 'chess.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private chess = new Chess();
  
  public currentFen = new BehaviorSubject<string>(this.chess.fen());
  
  public resetToStartingPosition() {
    this.chess.reset();
    this.currentFen.next(this.chess.fen());
  }

  public setPosition(fen: string): boolean {
    try {
      this.chess.load(fen);
      this.currentFen.next(this.chess.fen());
      return true;
    } catch {
      return false;
    }
  }

  public getLegalMoves(square: string): string[] {
    const moves = this.chess.moves({ square: square as any, verbose: true }) as Move[];
    return moves.map(m => m.to);
  }

  public move(source: string, target: string): false | Move {
    try {
      const move = this.chess.move({
        from: source,
        to: target,
        promotion: 'q' // Default to Queen for now
      });
      if (move) {
        this.currentFen.next(this.chess.fen());
        return move;
      }
    } catch (e) {
      // Invalid move caught
    }
    return false;
  }
  
  public get turnColor(): 'w' | 'b' {
    return this.chess.turn();
  }

  public get fen(): string {
    return this.chess.fen();
  }

  public get isGameOver(): boolean {
    return this.chess.isGameOver();
  }
}
