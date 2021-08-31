/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * - The Laya slot display.
     * @version DragonBones 5.6
     * @language en_US
     */
    /**
     * - Laya 插槽。
     * @version DragonBones 5.6
     * @language zh_CN
     */
    /**
     * @inheritDoc
     */
    export class LayaSlotDisplay extends Laya.Sprite {
        /**
         * @inheritDoc
         */
        public updateTransform(parent: Laya.Node) {
            if (!parent && !this.parent) {
                return this;
            }

            var p = this.parent;

            if (parent) {
                p = parent;
            }
            else if (!this.parent) {
                p = Laya.stage;
            }

            // create some matrix refs for easy access
            // var pt = p.worldTransform;
            // var wt = this.worldTransform;

            // temporary matrix variables
            var a, b, c, d, tx, ty;

            // so if rotation is between 0 then we can simplify the multiplication process..
            if (this.rotation % Math.PI) {
                // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
                if (this.rotation !== (this as any).rotationCache) {
                    (this as any).rotationCache = this.rotation;
                    (this as any)._sr = Math.sin(this.rotation);
                    (this as any)._cr = Math.cos(this.rotation);
                }

                var skew = (this as any).skew % Transform.PI_D; // Support skew.
                if (skew > 0.01 || skew < -0.01) {
                    // get the matrix values of the displayobject based on its transform properties..
                    a = (this as any)._cr * this.scaleX;
                    b = (this as any)._sr * this.scaleX;
                    c = -Math.sin(skew + this.rotation) * this.scaleY;
                    d = Math.cos(skew + this.rotation) * this.scaleY;
                    tx = this.x;
                    ty = this.y;
                }
                else {
                    // get the matrix values of the displayobject based on its transform properties..
                    a = (this as any)._cr * this.scaleX;
                    b = (this as any)._sr * this.scaleX;
                    c = -(this as any)._sr * this.scaleY;
                    d = (this as any)._cr * this.scaleY;
                    tx = this.x;
                    ty = this.y;
                }

                // check for pivot.. not often used so geared towards that fact!
                if (this.pivotX || this.pivotY) {
                    tx -= this.pivotX * a + this.pivotY * c;
                    ty -= this.pivotX * b + this.pivotY * d;
                }

                // concat the parent matrix with the objects transform.
                // wt.a = a * pt.a + b * pt.c;
                // wt.b = a * pt.b + b * pt.d;
                // wt.c = c * pt.a + d * pt.c;
                // wt.d = c * pt.b + d * pt.d;
                // wt.tx = tx * pt.a + ty * pt.c + pt.tx;
                // wt.ty = tx * pt.b + ty * pt.d + pt.ty;
            }
            else {
                // lets do the fast version as we know there is no rotation..
                a = this.scaleX;
                b = 0;
                c = 0;
                d = this.scaleY;
                tx = this.x - this.pivotX * a;
                ty = this.y - this.pivotY * d;

                // wt.a = a * pt.a;
                // wt.b = a * pt.b;
                // wt.c = d * pt.c;
                // wt.d = d * pt.d;
                // wt.tx = tx * pt.a + ty * pt.c + pt.tx;
                // wt.ty = tx * pt.b + ty * pt.d + pt.ty;
            }

            // a = wt.a;
            // b = wt.b;
            // c = wt.c;
            // d = wt.d;

            var determ = (a * d) - (b * c);

            if (a || b) {
                var r = Math.sqrt((a * a) + (b * b));

                // this.worldRotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
                // this.worldScale.x = r;
                // this.worldScale.y = determ / r;
            }
            else if (c || d) {
                var s = Math.sqrt((c * c) + (d * d));

                // this.worldRotation = Laya.Math.HALF_PI - ((d > 0) ? Math.acos(-c / s) : -Math.acos(c / s));
                // this.worldScale.x = determ / s;
                // this.worldScale.y = s;
            }
            else {
                // this.worldScale.x = 0;
                // this.worldScale.y = 0;
            }

            //  Set the World values
            // this.worldAlpha = this.alpha * p.worldAlpha;
            // this.worldPosition.x = wt.tx;
            // this.worldPosition.y = wt.ty;

            // reset the bounds each time this is called!
            (this as any)._currentBounds = null;

            //  Custom callback?
            // if ((this as any).transformCallback) {
            //     (this as any).transformCallback.call((this as any).transformCallbackContext, wt, pt);
            // }

            return this;
        }
    }
}
