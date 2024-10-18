import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { Course } from "../model/course";
import { CourseImageComponent } from "../course-image/course-image.component";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ["./course-card.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent
  implements
    OnInit,
    OnDestroy,
    OnChanges,
    AfterContentChecked,
    AfterViewChecked
{
  @Input()
  course: Course;

  @Input()
  cardIndex: number;

  // se definisco il nome come parametro del decoratore questo sarà il nome dell'evento emesso (courseChanged), altrimenti il nome sarà il nome della proprietà (courseEmitter)
  @Output("courseChanged")
  courseEmitter = new EventEmitter<Course>();

  // ricevo il valore passato dal parent component nell'attributo type invece che riceverlo come @Input, in questo modo la change detection non andrà a controllare se ci sono state modifiche in questo input
  constructor(@Attribute("type") private type: string) {
    console.log("constructor");
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  // nel momento in cui clicco il button destroy courses, ng aggiorna la view e diswtrugge i componenti, chiama i metodi in questo hook ed ho il console log per ogni componente distrutto
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("ngOnDestroy");
  }

  // chiamato subito dopo il costruttore, prima di ngOnInit
  // metodo utile se si vuole fare un confronto fra valori nuovi e vecchi
  // metodo chiamato da NG ogni volta che cambia qualcosa nelle @Input, dall'esterno, ogni volta che dal parent arriva un valore di @Input differente da quello corrente. Si attiva solo se si modifica il riferimento dell'oggetto e non una proprietà dell'oggetto stesso, deve essere quindi un nuovo oggetto
  // l'argomento changes è un oggetto contenente altri oggetti, ogni oggetto è una proprietà @Input con 3 proprietà: previousValue, currentValue e firstChange
  // SimpleChange è un type di angular
  // con il ciclo for in app.component.html l'onchanges non mi da il valore precedente perchè il componente viene distrutto per rieseguire il ciclo for, quindi ogni volta è come se fosse il primo change
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("ngOnChanges");
    console.log(changes);

    // console.log(changes.cardIndex.currentValue);
  }

  // metodo chiamato da NG ogni volta che finisce di controllare il content del component
  // tutte le volte che NG effettua la change detection
  // la logica che mettiamo in questo hook deve essere leggera perchè l'hook viene chiamato tantissime volte e potrebbe causare dei rallentamenti nella user interface
  // possiamo modificare solo le proprietà che non sono state utilizzate nella parte del content
  // ad esempio la proprietà iconUrl di course viene passata al componente course-image, viene quindi utilizzata prima della renderizzazione della view e quindi se provassi a modificarla riceverei un errore, NG non sa quale valore utilizzare, se il precedente o quello nuovo
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    console.log("ngAfterContentChecked");
    // cambio il titolo del corso dopo che è stato controllato
    this.course.description = "content checked";
  }

  //chiamato dopo l'ngAfterContentChecked
  // dopo aver controllato il content NG controlla il template per vedere se qualcosa è cambiato
  // non si può più modificare il contenuto
  // questo hook va utilizzato quando si vuole intervenire sulla vista dopo che tutto è stato controllato e caricato, ad esempio se volessi effettuare lo scroll della pagina in fondo dopo aver ricevuto tutti i dati, piccoli interventi sul DOM
  // anche qui non si deve implementare logica che vada ad appesantire la memoria
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    console.log("ngAfterViewChecked");
  }

  // il metodo onSaveClicked riceve il valore passato nell'input ed emette un evento custom che ha come payload un oggetto di tipo Course
  // copia di un oggetto tramite destrutturazione
  // tramite destrutturazione dell'oggetto creo una copia dell'oggetto Course dell'istanza e sostituisco il valore della proprietà description in esso contenuta con quello passato da input
  // se metto il parametro description fra parentesi graffe ottengo un oggetto chiave valore {nome_parametro: valore_parametro}
  // l'evento emesso viene ascolato in app.component.html
  onSaveClicked(description: string) {
    this.courseEmitter.emit({ ...this.course, description });
  }

  // ogni volta che viene chiamato il metodo onTitleChanged, il titolo del corso cambia
  // ogni volta si attiva la change detection di ng, dopo ogni evento gestito da ng, viene controllato tutto il componente e viene valutato cosa è cambiato rispetto a prima dell'evento
  // L'unico modo che Angular ha per essere sicuro che la vista rifletta sempre correttamente i dati è eseguire nuovamente tutti questi controlli e aggiornare i componenti ogni volta che è necessario.
  // di defaul la change detection di NG confronta l'ultimo valore di un oggetto mutabile di js con quello che c'è dopo un evento e controlla se è cambiato e se rileva una differenza aggiorna la view
  // possiamo cambiare il comportamento della change detection con la proprietà changeDetection del decoratore @Component
  onTitleChanged(newTitle: string) {
    this.course.description = newTitle;
  }
}
