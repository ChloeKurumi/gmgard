import { Injectable, Inject } from "@angular/core";
import { ENVIRONMENT, Environment } from "../../environments/environment_token";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { IVoucher, Voucher, newVoucher, SpinWheelStatus, SpinWheelResult, StockInfo, PrizeInfo } from "../models/Vouchers";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class WheelService {
  host: string;
  constructor(private http: HttpClient, @Inject(ENVIRONMENT) env: Environment) {
      this.host = env.apiHost
  }

  getStatus(): Observable<SpinWheelStatus> {
    return this.http.get<SpinWheelStatus>(this.host + "/api/Wheel/Get", { withCredentials: true })
      .pipe(map(s => {
        return {
          title: s.title,
          isActive: s.isActive,
          userPoints: s.userPoints,
          vouchers: s.vouchers.map(newVoucher),
          wheelAPrizes: s.wheelAPrizes,
          wheelBPrizes: s.wheelBPrizes,
          wheelACost: s.wheelACost,
          wheelBCost: s.wheelBCost,
          ceilingCost: s.ceilingCost,
        };
      }));
  }

  spin(type: string): Observable<SpinWheelResult> {
    return this.http.post<SpinWheelResult>(this.host + "/api/Wheel/Spin", null, { params: { "wheelType": type }, withCredentials: true });
  }

  getStock(): Observable<StockInfo[]> {
    return this.http.get<StockInfo[]>(this.host + "/api/Wheel/Stock", { withCredentials: true });
  }

  getForUser(name: string): Observable<IVoucher[]> {
    return this.http.get<IVoucher[]>(this.host + "/api/Wheel/GetForUser", { params: { name }, withCredentials: true });
  }

  addStock(name: string, count: number): Observable<HttpResponse<{}>> {
    return this.http.post(this.host + "/api/Wheel/Stock", null, { params: { prizeName: name, count: count.toString() }, withCredentials: true, observe: "response" });
  }

  redeemCeiling(): Observable<IVoucher> {
    return this.http.post<IVoucher>(this.host + "/api/Wheel/RedeemCeiling", null, { withCredentials: true });
  }

  redeemPoints(id: string): Observable<PrizeInfo> {
    return this.http.post<PrizeInfo>(this.host + "/api/Wheel/RedeemPoints", null, { params: { voucherId: id }, withCredentials: true });
  }

  exchange(id: string): Observable<IVoucher> {
    return this.http.post<IVoucher>(this.host + "/api/Wheel/Exchange", null, { params: { voucherId: id }, withCredentials: true });
  }

  markRedeemed(id: string): Observable<{}> {
    return this.http.post<{}>(this.host + "/api/Wheel/MarkRedeemed", null, { params: { voucherId: id }, withCredentials: true });
  }
}
