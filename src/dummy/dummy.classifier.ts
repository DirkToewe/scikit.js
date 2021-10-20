/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/

import {
  convertToNumericTensor1D,
  convertToNumericTensor1D_2D,
} from '../utils'
import { Scikit1D, ScikitVecOrMatrix } from '../types'
import { isScikitVecOrMatrix, assert, isScikit1D } from '../types.utils'
import { modeFast } from 'simple-statistics'
import { uniq, sample } from 'lodash'
/**
 * Standardize features by removing the mean and scaling to unit variance.
 * The standard score of a sample x is calculated as: `z = (x - u) / s`,
 * where `u` is the mean of the training samples, and `s` is the standard deviation of the training samples.
 */

type Strategy = 'mostFrequent' | 'uniform' | 'constant'

export default class DummyClassifier {
  $fill: number
  $strategy: string
  $uniques: Array<any>

  constructor(strategy: Strategy = 'mostFrequent', fill?: number) {
    this.$fill = fill || 0
    this.$strategy = strategy
    this.$uniques = []
  }

  /**
   * Fit a StandardScaler to the data.
   * @param data Array, Tensor, DataFrame or Series object
   * @returns StandardScaler
   * @example
   * const scaler = new StandardScaler()
   * scaler.fit([1, 2, 3, 4, 5])
   */
  fit(X: ScikitVecOrMatrix, y: Scikit1D): DummyClassifier {
    assert(isScikit1D(y), 'Data can not be converted to a 1D or 2D matrix.')
    assert(
      ['mostFrequent', 'uniform', 'constant'].includes(this.$strategy),
      `Strategy ${this.$strategy} not supported. We support 'mostFrequent', 'uniform', and 'constant'`
    )

    const newY = convertToNumericTensor1D(y)

    if (this.$strategy === 'mostFrequent') {
      this.$fill = modeFast(newY.arraySync())
      return this
    }
    if (this.$strategy === 'uniform') {
      this.$uniques = uniq(newY.arraySync() as number[])
      return this
    }
    // Handles 'constant' case
    return this
  }

  /**
   * Transform the data using the fitted scaler
   * @param data Array, Tensor, DataFrame or Series object
   * @returns Array, Tensor, DataFrame or Series object
   * @example
   * const scaler = new StandardScaler()
   * scaler.fit([1, 2, 3, 4, 5])
   * scaler.transform([1, 2, 3, 4, 5])
   * // [0.0, 0.0, 0.0, 0.0, 0.0]
   * */
  predict(X: ScikitVecOrMatrix) {
    assert(
      isScikitVecOrMatrix(X),
      'Data can not be converted to a 1D or 2D matrix.'
    )
    assert(
      ['mostFrequent', 'uniform', 'constant'].includes(this.$strategy),
      `Strategy ${this.$strategy} not supported. We support 'mostFrequent', 'uniform', and 'constant'`
    )
    let newData = convertToNumericTensor1D_2D(X)
    let length = newData.shape[0]
    if (this.$strategy === 'mostFrequent' || this.$strategy === 'constant') {
      return Array(length).fill(this.$fill)
    }

    // "Uniform case"
    let returnArr = []
    for (let i = 0; i < length; i++) {
      returnArr.push(sample(this.$uniques))
    }
    return returnArr
  }

  /**
   * Fit and transform the data using the fitted scaler
   * @param data Array, Tensor, DataFrame or Series object
   * @returns Array, Tensor, DataFrame or Series object
   * @example
   * const scaler = new StandardScaler()
   * scaler.fit([1, 2, 3, 4, 5])
   * scaler.fitTransform([1, 2, 3, 4, 5])
   * // [0.0, 0.0, 0.0, 0.0, 0.0]
   * */
  fitPredict(X: ScikitVecOrMatrix, y: Scikit1D) {
    return this.fit(X, y).predict(X)
  }
}
