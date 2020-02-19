import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StatisticNavComponent } from './components/statistic-nav/statistic-nav.component';
import { StatisticListComponent } from './components/statistic-list/statistic-list.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { StatisticGraphicComponent } from './components/statistic-graphic/statistic-graphic.component';

@NgModule({
  declarations: [StatisticNavComponent, StatisticListComponent, StatisticComponent, StatisticGraphicComponent],
  imports: [CommonModule]
})
export class StatisticsModule {}
