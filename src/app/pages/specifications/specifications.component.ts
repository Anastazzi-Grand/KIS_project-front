import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpecificationService, Specification, TransformSpecification } from '../../services/specifications.service';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { Observable, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon'
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogDataComponent } from './addDialogData/addDialogData.component';



interface FlatNode {
  expandable: boolean;
  description: string;
  level: number;
  id: number;
  name: string;
}


@Component({
  selector: 'app-specifications',
  standalone: true,
  imports: [
    CommonModule, MatTreeModule, MatIconModule, MatButtonModule,
  ],
  templateUrl: './specifications.component.html',
  styleUrl: './specifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecificationsComponent {

  private _transformer = (node: TransformSpecification, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      description: node.description,
      id: node.positionid,
      level: level,
      name: `${node.description}, id: ${node.positionid}`
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSpecifications$ = this.specificationService.getSpecifications().pipe(
    map(data => {
      const dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      dataSource.data = this.buildTree(data)
      console.log(this.buildTree(data));
      return dataSource! as unknown as FlatNode[];
    })
  );


  constructor(private specificationService: SpecificationService, public dialog: MatDialog) {
    this.dataSpecifications$.subscribe();
  }

  openAddSpecificationDialog(): void {
    const dialogRef = this.dialog.open(AddDialogDataComponent, {
      width: '400px', // задайте ширину окна по вашему усмотрению
      data: {} // передайте данные при необходимости
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The add specification dialog was closed');
      // обработка закрытия диалогового окна, если это необходимо
    });
  }

  buildTree(items: Specification[]): TransformSpecification[] {
    const rootNodes: TransformSpecification[] = [];

    const itemMap: Map<number, TransformSpecification> = new Map();

    // Сначала создаем все элементы и добавляем их в карту
    for (const item of items) {
      const transformItem: TransformSpecification = {
        positionid: item.positionid,
        children: [], // Теперь children - это массив
        description: item.description,
        quantityPerParent: item.quantityPerParent,
        unitMeasurement: item.unitMeasurement
      };

      itemMap.set(item.positionid, transformItem);

      if (!item.parent) {
        rootNodes.push(transformItem);
      }
    }

    // Затем устанавливаем связи между родителями и детьми
    for (const item of items) {
      if (item.parent) {
        const parent = itemMap.get(item.parent.positionid);
        const child = itemMap.get(item.positionid);
        if (parent && child) {
          parent.children.push(child);
        }
      }
    }

    return rootNodes;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
