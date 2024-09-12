import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog'; // Add this

@NgModule({
  exports: [
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule, // Add this
  ],
})
export class MaterialModule {}
