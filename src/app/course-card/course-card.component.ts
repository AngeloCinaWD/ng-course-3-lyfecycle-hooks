import {
  AfterContentInit,
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation,
} from "@angular/core";
import { Course } from "../model/course";
import { CourseImageComponent } from "../course-image/course-image.component";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ["./course-card.component.css"],
  // se il nostro componente utilizza il metodo OnPUsh per il rilevamento delle modifiche, ng non analizzerà ogni espressione del template per rilevare modifiche, cercherà di rilevare i cambiamenti nei dati di @Input del componente
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent implements OnInit {
  @Input()
  course: Course;

  @Input()
  cardIndex: number;

  // se definisco il nome come parametro del decoratore questo sarà il nome dell'evento emesso (courseChanged), altrimenti il nome sarà il nome della proprietà (courseEmitter)
  @Output("courseChanged")
  courseEmitter = new EventEmitter<Course>();

  // ricevo il valore passato dal parent component nell'attributo type invece che riceverlo come @Input, in questo modo la change detection non andrà a controllare se ci sono state modifiche in questo input
  constructor(@Attribute("type") private type: string) {
    console.log(type);
  }

  ngOnInit() {}

  // il metodo onSaveClicked riceve il valore passato nell'input ed emette un evento custom che ha come payload un oggetto di tipo Course
  // copia di un oggetto tramite destrutturazione
  // tramite destrutturazione dell'oggetto creo una copia dell'oggetto Course dell'istanza e sostituisco il valore della proprietà description in esso contenuta con quello passato da input
  // se metto il parametro description fra parentesi graffe ottengo un oggetto chiave valore {nome_parametro: valore_parametro}
  // l'evento emesso viene ascolato in app.component.html
  onSaveClicked(description: string) {
    this.courseEmitter.emit({ ...this.course, description });
  }

  // ogni volta che viene chiamato questo metodo, il titolo del corso cambia
  // ogni volta si attiva la change detection di ng, dopo ogni evento gestito da ng, viene controllato tutto il componente e viene valutato cosa è cambiato rispetto a prima dell'evento
  // L'unico modo che Angular ha per essere sicuro che la vista rifletta sempre correttamente i dati è eseguire nuovamente tutti questi controlli e aggiornare i componenti ogni volta che è necessario.
  // di defaul la change detection di NG confronta l'ultimo valore di un oggetto mutabile di js con quello che c'è dopo un evento e controlla se è cambiato e se rileva una differenza aggiorna la view
  // possiamo cambiare il comportamento della change detection con la proprietà changeDetection del decoratore @Component
  onTitleChanged(newTitle: string) {
    this.course.description = newTitle;
  }
}
