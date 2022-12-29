import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
  ],
})
export class MaterialModule {}
