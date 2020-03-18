import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { GachaService } from "./gacha.service";
import { GachaItemDetails } from "../models/GachaResult";

@Component({
  selector: "app-card-detail",
  templateUrl: "./card-detail.component.html",
  styleUrls: ["./card-detail.component.css"]
})
export class CardDetailComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: string, private gachaService: GachaService) { }

    loading = true;
    item: GachaItemDetails;

    private unknownItem: GachaItemDetails = {
        name: "unknown",
        title: "???",
        description: "??????",
        itemCount: 0,
        rarity: 0,
    }

    ngOnInit() {
        this.gachaService.getDetails(this.data).subscribe(i => {
            this.loading = false;
            this.item = i || this.unknownItem;
        });
    }

}
