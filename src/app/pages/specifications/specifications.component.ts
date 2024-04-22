import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { SpecificationService, Specification, TransformSpecification } from '../../services/specifications.service';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon'
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDialogDataComponent } from './changeDialogData/changeDialogData.component';
import { DeleteDialogDataComponent } from './deleteDialogData/deleteDialogData.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



export interface FlatNode {
  expandable: boolean;
  description: string;
  level: number;
  positionid: number;
  name: string;
  parent: Specification | null;
  parentPositionId: number | null;
  quantityPerParent: number;
  unitMeasurement: string;
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
      positionid: node.positionid,
      level: level,
      name: `${node.description}, id: ${node.positionid}`,
      parent: node.parent,
      quantityPerParent: node.quantityPerParent,
      unitMeasurement: node.unitMeasurement,
      parentPositionId: node.parent?.positionid ?? null
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

  refresh$ = new BehaviorSubject(undefined);

  dataSpecifications$ = this.refresh$.pipe(
    switchMap(() => this.specificationService.getSpecifications()),
    map(data => {
      const dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      dataSource.data = this.buildTree(data)
      console.log(this.buildTree(data));
      return dataSource! as unknown as FlatNode[];
    }),
    shareReplay(1)
  );

  destroyRef = inject(DestroyRef)

  constructor(private specificationService: SpecificationService, public dialog: MatDialog) {
    this.dataSpecifications$.subscribe();
  }

  openAddSpecificationDialog(): void {
    const dialogRef = this.dialog.open(ChangeDialogDataComponent, {
      width: '400px', 
      data: null 
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The add specification dialog was closed');
    });
  }

  openChangeSpecificationDialog(node: FlatNode): void {
    const dialogRef = this.dialog.open(ChangeDialogDataComponent, {
      width: '400px',
      data: node
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The add specification dialog was closed');
    });
  }

  openDeleteSpecificationDialog(node: FlatNode): void {
    const dialogRef = this.dialog.open(DeleteDialogDataComponent, {
      width: '400px',
      data: node.positionid
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The add specification dialog was closed');
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
        unitMeasurement: item.unitMeasurement,
        parent: item.parent ?? null,
        parentPositionId: item.parent?.positionid ?? null
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
