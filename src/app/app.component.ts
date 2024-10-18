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
import { observable, Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CoursesService } from "./services/courses.service";
import { APP_CONFIG, AppConfig, CONFIG_TOKEN } from "./configurazioniApp";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  courses: Course[];

  courses$: Observable<Course[]>;

  coursesService$: Observable<Course[]>;

  // ogni volta che viene creato un componente NG chiama il costruttore,il suo scopo principale sarebbe quello di passare le dipendenze che serviranno al componente
  // non vengono popolate le variabili di @Input
  constructor(
    private http: HttpClient,
    @Optional() private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private configObject: AppConfig
  ) {
    console.log(configObject);
  }

  // i metodi in questo gancio vengo chiamati solo una volta, dopo quelli del costruttore
  // entrambi vengono chiamati una volta ad ogni creazione del componente
  // la differenza principale tra il costruttore e l'onInit è che nel costruttore le variabili di @Input della classe come ad esempio courses sono undefined, non sono popolate, in onInit si
  // la logica del componente va inserita qui e non nel costruttore che non ne dovrebbe contenere
  ngOnInit() {
    const params = new HttpParams().set("page", "1").set("pageSize", "10");
    const headerCourses = new HttpHeaders().set("X-Courses", "courses");
    const headerCourses$ = new HttpHeaders().set("X-Courses", "courses$");

    // valorizzo la variabile courses con un observable dopo averlo sottoscritto
    this.http
      .get<Course[]>("/api/courses", { params: params, headers: headerCourses })
      .subscribe((valore) => {
        console.log(valore);
        this.courses = valore;
      });

    // la variabile courses$ è un observable che viene sottoscritto nel template tramite pipe async
    this.courses$ = this.http.get<Course[]>("/api/courses", {
      params: params,
      headers: headerCourses$,
    });

    this.coursesService$ = this.coursesService.loadCourses();
  }

  // lyfecycle hook giusto per terminare processi come iscrizione ad un observable
  // lo provo nel coursecardcomponent
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  onCourseChanged(course: Course) {
    this.coursesService
      .saveCourse(course)
      .subscribe((value) => console.log(value.description));
  }

  destroyCourses() {
    this.courses = [];
  }

  // metodo che cambia la description del corso 0
  // per triggerare l'onChanges del componente figlio non posso modificare la description dello stesso oggetto Course, ma devo andare a modificare l'intero oggetto
  // ne creo una copia, gli cambio la description e poi dico che il vecchio corso 0 è uguale alla sua copia modificata
  // avevo lavorato con l'observable in courses$ poi per modificare ho riutilizzato courses
  // async changeDescriptionCourse0() {
  changeDescriptionCourse0() {
    // let courses: Course[] = await this.courses$.toPromise();

    // this.courses$.pipe().subscribe((value) => console.log(value));

    const course: Course = this.courses[0];

    const newCourse: Course = {
      ...course,
      description: "new description",
    };

    this.courses[0] = newCourse;
  }
}
