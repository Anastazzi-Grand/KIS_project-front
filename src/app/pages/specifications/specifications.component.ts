import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { SpecificationService, Specification, TransformSpecification } from '../../services/specifications.service';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon'
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDialogDataComponent } from './changeDialogData/changeDialogData.component';
import { DeleteDialogDataComponent } from './deleteDialogData/deleteDialogData.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  children: TransformSpecification[];
}


@Component({
  selector: 'app-specifications',
  standalone: true,
  imports: [
    CommonModule, MatTreeModule, MatIconModule, 
    MatButtonModule, MatTooltipModule
  ],
  templateUrl: './specifications.component.html',
  styleUrl: './specifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SpecificationsComponent {


  private _transformer = (node: TransformSpecification, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      description: node.description,
      positionid: node.positionid,
      level: level,
      name: `${node.description}, id: ${node.positionid}`,
      parent: node.parent,
      quantityPerParent: node.quantityPerParent,
      unitMeasurement: node.unitMeasurement,
      parentPositionId: node.parent?.positionid ?? null,
      children: node.children
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
      //console.log(this.buildTree(data));
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
        children: [],
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

  getDescription(node: FlatNode): string {
    const materialsMap = this.getMaterialsOfSpecification(node);
  
    let s = 'МАТЕРИАЛЫ ' + Object.entries(materialsMap)
    .map(([material, { quantity, unit }]) => `${material}: ${quantity} ${unit}`)
    .join(', ');

    return s;
  }

  getMaterialsOfSpecification(node: FlatNode) : Record<string, { quantity: number, unit: string }> {
    const materialsMap: Record<string, { quantity: number, unit: string }> = {};
  
    const lastChildren = this.getLeafMaterials(node);

    lastChildren.forEach(child => {
      const { description, unitMeasurement, quantityPerParent } = child;
      const key = description;
      const quantity = quantityPerParent;
  
      if (materialsMap[key]) {
        materialsMap[key].quantity += quantity;
      } else {
        materialsMap[key] = { quantity, unit: unitMeasurement };
      }
    });

    return materialsMap;
  }

  getLeafMaterials(node: FlatNode | TransformSpecification): TransformSpecification[] {
    const leaves: TransformSpecification[] = [];
    const lastChildren = this.getLastChildren(node);
  
    lastChildren.forEach(leaf => {
      const { positionid, description, unitMeasurement, parent, parentPositionId } = leaf;
      const quantity = this.calculateQuantityForLeaf(leaf);
  
      leaves.push({
        positionid,
        description,
        quantityPerParent: quantity,
        unitMeasurement,
        parent,
        parentPositionId,
        children: []
      });
    });
  
    return leaves;
  }

  private calculateQuantityForLeaf(node: TransformSpecification) : number {
    let quantity = node.quantityPerParent;
    if (node.parent) {
      quantity *= node.parent.quantityPerParent;
    }
    return quantity;
  }
  
  private getLastChildren(node: FlatNode | TransformSpecification, set: TransformSpecification[] = []): TransformSpecification[] {
    if (node?.children?.length) {
      node.children.forEach(n => this.getLastChildren(n, set))
    } else {
      set.push(node as TransformSpecification);
    }
  
    return set;
  }
}
