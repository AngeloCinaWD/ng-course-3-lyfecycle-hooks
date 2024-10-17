import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CourseCardComponent } from "./course-card/course-card.component";
import { CourseImageComponent } from "./course-image/course-image.component";
import { HighlightedDirective } from "./directives/highlighted.directive";
import { NgxUnlessDirective } from "./directives/ngx-unless.directive";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { CoursesService } from "./services/courses.service";

@NgModule({
  declarations: [
    AppComponent,
    CourseCardComponent,
    CourseImageComponent,
    HighlightedDirective,
    NgxUnlessDirective,
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  //   registro il provider per istanziare la classe del service CoursesService ed utilizzarne la dipendenza in qualsiasi parte del progetto (dove c'è un costruttore per la dependency injection....)
  //   providers: [provideHttpClient(withInterceptorsFromDi()), CoursesService],
})
export class AppModule {}
