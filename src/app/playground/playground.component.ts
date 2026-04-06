import {
  afterNextRender,
  Component,
  ElementRef,
  viewChild,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { GameStateService } from '../services/game-state.service';
import { ChessEngineService, EngineMessage, EngineInfo } from '../services/chess-engine.service';
import { Subscription } from 'rxjs';
import { Color, Key } from 'chessground/types';

@Component({
  selector: 'nv-playground',
  imports: [CommonModule, FormsModule],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css',
})
export class PlaygroundComponent implements OnDestroy, OnInit {
  protected container = viewChild.required<ElementRef<HTMLElement>>('container');
  
  private gameState = inject(GameStateService);
  private engine = inject(ChessEngineService);
  
  private cgApi!: Api;
  private subs = new Subscription();
  
  public mode = signal<'PLAY_VS_MACHINE' | 'SELF_LEARNING'>('PLAY_VS_MACHINE');
  public fenInput = signal<string>('');
  
  public engineScore = signal<number | string>(0);
  public isMate = signal<boolean>(false);
  public bestLine = signal<string[]>([]);
  public difficultyDepth = signal<number>(15);

  public formatScore = computed(() => {
    if (this.isMate()) {
      return `M${Math.abs(Number(this.engineScore()))}`;
    }
    return (Number(this.engineScore()) / 100).toFixed(2);
  });

  constructor() {
    afterNextRender(() => {
      this.initChessground();
      this.syncBoardToState();
    });
  }

  ngOnInit() {
    this.subs.add(
      this.gameState.currentFen.subscribe(fen => {
        if (this.cgApi) {
          this.syncBoardToState();
        }
        
        // Trigger evaluate
        this.engine.evaluatePosition(fen, this.difficultyDepth());
      })
    );

    this.subs.add(
      this.engine.getMessages().subscribe(msg => {
        if (msg.type === 'info') {
          const info = msg.data as EngineInfo;
          this.engineScore.set(info.score);
          this.isMate.set(info.isMate);
          this.bestLine.set(info.bestLine);
          
          if (this.mode() === 'SELF_LEARNING' && info.bestLine.length > 0) {
            const bestMoveStr = info.bestLine[0];
            if (bestMoveStr && bestMoveStr.length >= 4) {
               this.drawEngineArrow(bestMoveStr);
            }
          }
        } else if (msg.type === 'bestmove') {
          const move = msg.data as string;
          if (this.mode() === 'PLAY_VS_MACHINE' && this.gameState.turnColor === 'b') {
             // Apply machine move
             const orig = move.substring(0, 2);
             const dest = move.substring(2, 4);
             this.applyMove(orig, dest);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initChessground() {
    this.cgApi = Chessground(this.container().nativeElement, {
      movable: {
        color: 'white',
        free: false,
        events: {
          after: (orig: Key, dest: Key) => {
            this.applyMove(orig, dest);
          }
        }
      },
      drawable: {
        enabled: true,
        visible: true,
      }
    });
  }

  private drawEngineArrow(uciMove: string) {
     if (this.cgApi) {
         const orig = uciMove.substring(0,2) as Key;
         const dest = uciMove.substring(2,4) as Key;
         this.cgApi.setShapes([{
             orig,
             dest,
             brush: 'green'
         }]);
     }
  }

  private applyMove(orig: string, dest: string) {
    const validMove = this.gameState.move(orig, dest);
    if (!validMove) {
      if (this.cgApi) this.cgApi.set({ fen: this.gameState.fen });
    }
  }

  private syncBoardToState() {
     const fen = this.gameState.fen;
     const turnColor = this.gameState.turnColor === 'w' ? 'white' : 'black';
     const movableColor = (this.mode() === 'PLAY_VS_MACHINE') ? 'white' : 'both';
     
     const dests = new Map<Key, Key[]>();
     if ((this.mode() === 'PLAY_VS_MACHINE' && turnColor === 'white') || this.mode() === 'SELF_LEARNING') {
         const SQUARES = ['a8','b8','c8','d8','e8','f8','g8','h8',
                          'a7','b7','c7','d7','e7','f7','g7','h7',
                          'a6','b6','c6','d6','e6','f6','g6','h6',
                          'a5','b5','c5','d5','e5','f5','g5','h5',
                          'a4','b4','c4','d4','e4','f4','g4','h4',
                          'a3','b3','c3','d3','e3','f3','g3','h3',
                          'a2','b2','c2','d2','e2','f2','g2','h2',
                          'a1','b1','c1','d1','e1','f1','g1','h1'];
         for (const s of SQUARES) {
            const moves = this.gameState.getLegalMoves(s);
            if (moves.length) dests.set(s as Key, moves as Key[]);
         }
     }
     
     if (this.cgApi) {
        this.cgApi.set({
           fen,
           turnColor,
           movable: {
              color: movableColor as Color | 'both',
              dests
           }
        });
        
        if (this.mode() !== 'SELF_LEARNING') {
           this.cgApi.setShapes([]);
        }
     }
  }

  public setMode(newMode: 'PLAY_VS_MACHINE' | 'SELF_LEARNING') {
    this.mode.set(newMode);
    if (newMode === 'PLAY_VS_MACHINE' && this.gameState.turnColor === 'b') {
       this.engine.evaluatePosition(this.gameState.fen, this.difficultyDepth());
    }
    this.syncBoardToState();
  }

  public loadFen() {
    const f = this.fenInput();
    if (f) {
      if (!this.gameState.setPosition(f)) {
         alert('Invalid FEN combination.');
      }
      this.fenInput.set('');
    }
  }
}
