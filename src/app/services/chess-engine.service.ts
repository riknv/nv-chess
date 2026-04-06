import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';

export interface EngineInfo {
  isMate: boolean;
  score: number; // Centipawns or moves to mate
  bestLine: string[];
}

export interface EngineMessage {
  type: 'bestmove' | 'info';
  data: string | EngineInfo;
}

@Injectable({
  providedIn: 'root'
})
export class ChessEngineService {
  private worker!: Worker;
  private messageSubject = new Subject<EngineMessage>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initWorker();
    }
  }

  private initWorker() {
    // Load the web worker from public directory
    this.worker = new Worker('stockfish.js');
    this.worker.onmessage = (event) => {
      const line = event.data;
      if (typeof line !== 'string') return;
      
      if (line.startsWith('bestmove')) {
        const match = line.match(/^bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (match) {
          this.messageSubject.next({ type: 'bestmove', data: match[1] });
        }
      } else if (line.startsWith('info depth')) {
        const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
        const pvMatch = line.match(/ pv (.*)/);
        if (scoreMatch) {
          const isMate = scoreMatch[1] === 'mate';
          const score = parseInt(scoreMatch[2], 10);
          const bestLine = pvMatch ? pvMatch[1].split(' ') : [];
          this.messageSubject.next({ type: 'info', data: { isMate, score, bestLine } });
        }
      }
    };
    this.worker.postMessage('uci');
  }

  public getMessages(): Observable<EngineMessage> {
    return this.messageSubject.asObservable();
  }

  public evaluatePosition(fen: string, depth: number = 15) {
    if (this.worker) {
      this.worker.postMessage('stop');
      this.worker.postMessage('isready');
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    }
  }
}
