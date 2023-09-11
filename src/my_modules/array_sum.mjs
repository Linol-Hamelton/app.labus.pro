export default async function arrSumUniq(array1, array2, array3) {
    // Combine the four arrays
    var combinedArray = array1.concat(array2, array3);
  
    // Create a set to store unique values
    var uniqueSet = new Set();
  
    // Add elements to the set
    combinedArray.forEach((element) => {
      uniqueSet.add(element);
    });
  
    // Convert the set back to an array
    var uniqueArray = Array.from(uniqueSet);
  
    return uniqueArray;
  }