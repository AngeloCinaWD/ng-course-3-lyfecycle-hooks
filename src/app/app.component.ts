import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Inject,
  InjectionToken,
  OnInit,
  Optional,
  QueryList,
  Self,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { COURSES } from "../db-data";
import { Course } from "./model/course";
import { CourseCardComponent } from "./course-card/course-card.component";
import { HighlightedDirective } from "./directives/highlighted.directive";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CoursesService } from "./services/courses.service";
import { APP_CONFIG, AppConfig, CONFIG_TOKEN } from "./configurazioniApp";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // se utilizzo la change detection in modalità OnPush posso visualizzare i dati sullo schermo solo in 3 casi: se c'è un cambiamento dovuto ad un evento, o ad un evento legato ad un cambiamento del dom o un evento customizzato. Oppure se i dati vengono passati tramite @Input al componente e qualcosa di questi cambia. Oppure se i dati vengono ricevuti dal template attraverso l'utilizzo del pipe ASYNC
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// la CHANGE DETECTION è un meccanismo con il quale ng ricostruisce la view ogni volta che il model cambia
export class AppComponent implements OnInit, DoCheck {
  // se faccio arrivare i dati tramite assegnazione di observable a questa variabile, che all'inizio è undefined, non li vedrò sullo schermo perchè non si avvera nessuno dei 3 casi per cui la change detection OnPush ritiene che debbano essere renderizzati
  // courses: Course[] = COURSES;
  courses: Course[];

  courses$: Observable<Course[]>; // valore assegnato ricevndo lìobservable tramite chiamata con HttpClient direttamente dal componente

  coursesService$: Observable<Course[]>; // valore assegnato ricevendo l'observable tramite service

  // ogni componente di NG ha a disposizione un ChangeDetector che può essere iniettato ed utilizzato per dichiarare manualmente che qualcosa deve essere controllato da ng
  constructor(
    private http: HttpClient,
    @Optional() private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private configObject: AppConfig,
    private changeDetector: ChangeDetectorRef
  ) {
    console.log(configObject);
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    this.changeDetector.markForCheck();
  }

  ngOnInit() {
    const params = new HttpParams().set("page", "1").set("pageSize", "10");

    // valorizzo la variabile courses con un observable dopo averlo sottoscritto
    this.http
      .get<Course[]>("/api/courses", { params: params })
      .subscribe((valore) => {
        console.log(valore);
        this.courses = valore;

        // utilizzo il metodo markForCheck del change detector per dire ad ng che questo componente deve essere controllato
        // ora i dati passati alla variabile courses, pur non essendo uno dei 3 casi in cui la changedetection OnPush controlla e renderizza qualcosa, verrano visualizzati a schermo
        // il controllo viene effettuato ogni volta che l'observable viene emesso
        // il modo corretto di utilizzare questo metodo per customizzare la change detection, non è mettendolo qui, ma all'interno del lyfecycle hook DoCheck
        // this.changeDetector.markForCheck();
      });

    // la variabile courses$ è un observable che viene sottoscritto nel template tramite pipe async
    this.courses$ = this.http.get<Course[]>("/api/courses", { params: params });

    this.coursesService$ = this.coursesService.loadCourses();
  }

  onCourseChanged(course: Course) {
    this.coursesService
      .saveCourse(course)
      .subscribe((value) => console.log(value.description));
  }
}
