import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TriviaItem {
  id: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Trivia GianTV');
  readonly isStarted = signal(false);
  readonly currentItem = signal<TriviaItem | null>(null);
  readonly answer = signal('');
  readonly resultMessage = signal('');
  readonly isCorrect = signal(false);
  readonly score = signal({ correct: 0, incorrect: 0 });
  readonly blurLevel = signal(28);

  private readonly items: TriviaItem[] = [
    { id: '1', title: 'Antonio laje', image: this.buildImagePath('antonio laje.jpg') },
    { id: '2', title: 'Bassssssta de hacklife', image: this.buildImagePath('bassssssta de hacklife.jpg') },
    { id: '3', title: 'Basta de memes del kun y carpincho', image: this.buildImagePath('basta de memes del kun y carpincho.jpg') },
    { id: '4', title: 'Covid', image: this.buildImagePath('covid.jpg') },
    { id: '5', title: 'El chico que robo a instagram', image: this.buildImagePath('el chico que robo a instagram.jpg') },
    { id: '6', title: 'Feminismo de carotn', image: this.buildImagePath('feminismo de carotn.jpg') },
    { id: '7', title: 'Fort', image: this.buildImagePath('fort.jpg') },
    { id: '8', title: 'Guido kafka', image: this.buildImagePath('guido kafka.jpg') },
    { id: '9', title: 'Johny allon', image: this.buildImagePath('johny allon.jpg') },
    { id: '10', title: 'Las puertas', image: this.buildImagePath('las puertas.jpg') },
    { id: '11', title: 'Novelas del trece', image: this.buildImagePath('novelas del trece.jpg') },
    { id: '12', title: 'Reaccion ah video', image: this.buildImagePath('reaccion ah video.jpg') },
    { id: '13', title: 'Rombai', image: this.buildImagePath('rombai.jpg') },
    { id: '14', title: 'Rugbier', image: this.buildImagePath('rugbier.jpg') },
    { id: '15', title: 'Tinder fuera real', image: this.buildImagePath('tinder fuera real.jpg') },
    { id: '16', title: 'Top galletitsa', image: this.buildImagePath('top galletitsa.jpg') },
    { id: '17', title: 'Travel rock', image: this.buildImagePath('travel rock.jpg') },
    { id: '18', title: 'Tv publica', image: this.buildImagePath('tv publica.jpg') },
    { id: '19', title: 'Upd', image: this.buildImagePath('upd.jpg') },
    { id: '20', title: 'Viaje a disney', image: this.buildImagePath('viaje a disney.jpg') },
    { id: '21', title: 'Viraltv', image: this.buildImagePath('viraltv.jpg') }
  ];

  private lastItemId: string | null = null;

  private buildImagePath(fileName: string): string {
    return `/images/miniaturas/${encodeURIComponent(fileName)}`;
  }

  startGame(): void {
    this.isStarted.set(true);
    this.resetRound();
    this.currentItem.set(this.getRandomItem());
  }

  submitAnswer(): void {
    const item = this.currentItem();
    const input = this.answer().trim();

    if (!item || !input) {
      this.resultMessage.set('Escribí una respuesta para continuar.');
      this.isCorrect.set(false);
      return;
    }

    const isMatch = this.normalizeText(input) === this.normalizeText(item.title);
    this.isCorrect.set(isMatch);
    this.resultMessage.set(isMatch ? '¡Correcto!' : `No fue correcto. El título era: ${item.title}`);
    this.blurLevel.set(0);

    if (isMatch) {
      this.score.update((value) => ({ ...value, correct: value.correct + 1 }));
    } else {
      this.score.update((value) => ({ ...value, incorrect: value.incorrect + 1 }));
    }
  }

  nextQuestion(): void {
    this.answer.set('');
    this.resultMessage.set('');
    this.isCorrect.set(false);
    this.blurLevel.set(28);
    this.currentItem.set(this.getRandomItem());
  }

  normalizeText(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getRandomItem(): TriviaItem {
    const availableItems = this.items.filter((item) => item.id !== this.lastItemId);
    const source = availableItems.length ? availableItems : this.items;
    const randomIndex = Math.floor(Math.random() * source.length);
    const item = source[randomIndex];
    this.lastItemId = item.id;
    return item;
  }

  private resetRound(): void {
    this.answer.set('');
    this.resultMessage.set('');
    this.isCorrect.set(false);
    this.blurLevel.set(28);
  }
}
