# Correlation Method
import pandas as pd  # import pandas for workin with dataframes
import numpy as np  # numpy used for numeric operations
import matplotlib.pyplot as plt  # For make plots and graphs
import seaborn as sns  # used for visualise data
from sklearn.model_selection import train_test_split  # for splitting data into train n test
from sklearn.linear_model import LinearRegression  # to use linear regression model
from sklearn.metrics import mean_squared_error, r2_score  # For checking model's performance

# METHOD 1 FOR LOADING DATA
# data = {
#     'kills': [3, 0, 5, 1, 2],  # No. of kills player has
#     'damageDealt': [450.0, 100.0, 950.0, 300.0, 650.0],  # How much damage is done
#     'winPlacePerc': [0.76, 0.22, 0.89, 0.45, 0.60],  # Win place percentage
#     'boosts': [4, 0, 2, 1, 3],  # No. of boosts used
#     'heals': [3, 1, 5, 2, 3],  # Total healing items used
#     'walkDistance': [1200, 200, 1500, 800, 1100],  # How much distance walked in meters
#     'rideDistance': [0, 300, 0, 1000, 200],  # Distance travelled by vehicle
#     'swimDistance': [0, 0, 0, 50, 20],  # Distance travelled by swimming
#     'headshotKills': [1, 0, 2, 0, 1],  # Total kills by headshots
#     'killStreaks': [1, 0, 2, 0, 1]  # Number of kill streaks
# }
# df = pd.DataFrame(data);  # Converting data into dataframe

# METHOD 2 FOR LOADING DATA
url = 'https://raw.githubusercontent.com/akki8087/Big-Mart-Sales/master/Train.csv'  # Location of the dataset online
df = pd.read_csv(url)  # Load data from url

# Print dataset information
df.info()  # Shows info about data columns, types, and nulls

# Check for missing values
print(df.isnull().sum())  # Shows missing value counts per column

# Fill missing values
df['Item_Weight'].fillna(df['Item_Weight'].median(), inplace=True)  # Fill missing item weight with median
df['Outlet_Size'].fillna(df['Outlet_Size'].mode().iloc[0], inplace=True)  # Fill missing outlet sizes with most occuring one

# Confirm missing values are filled
print(df[['Item_Weight', 'Outlet_Size']].isnull().sum())  # Check if nulls are gone from theese columns

# Correlation matrix
corr_matrix = df.corr(numeric_only=True)  # Get correlation of only numeric columns
print(corr_matrix)  # Print the whole correlation matrix

# Heatmap
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')  # Create heatmap with color scale
plt.title('Correlation Heatmap')  # Add a title to the heatmap
plt.show()  # Show the heatmap plot

# Corrected scatter plot
plt.figure(figsize=(10, 6))  # Set bigger size for the plot
sns.scatterplot(x='Item_Weight', y='Item_MRP', data=df)  # Scatter plot showing Item Weight vs Item MRP
plt.title('Item MRP with respect to Item Weight')  # Add the title for scatterplot
plt.xlabel('Item Weight')  # Set x-axis label
plt.ylabel('Item MRP')  # Set y-axis label
plt.show()  # Display scatter plot

# Regression plot
sns.regplot(x='Item_Weight', y='Item_MRP', data=df, line_kws={'color': 'red'})  # Add regression line to scatter
plt.title('Regression Plot: Item Weight vs. Item MRP')  # Add title to regression plot
plt.xlabel('Item Weight')  # Label the x-axis
plt.ylabel('Item MRP')  # Label the y-axis
plt.show()  # Show the regression plot



























# PCA METHOD
import numpy as np  # numpy used for numeric calculations
import pandas as pd  # pandas to handle datasets
from sklearn.decomposition import PCA  # Importing PCA for dimension reduction
import matplotlib.pyplot as plt  # For plotting graphs

# Simulated data for 10 students
data = {
    "Study Hours": [5, 3, 4, 6, 5, 2, 3, 4, 5, 6],  # Hours spend studying by students
    "Recreation Hours": [2, 4, 3, 1, 2, 5, 4, 3, 2, 1],  # Recreation time in hours
    "Attendance (%)": [90, 75, 80, 95, 85, 60, 70, 75, 85, 95],  # Attendance in percentage
    "Assignments Submitted": [8, 5, 6, 9, 7, 3, 4, 6, 7, 9],  # Number of assignments submitted
    "Sleep Hours": [7, 6, 6.5, 8, 7, 5, 5.5, 6, 7, 8]  # Average sleep hours
}

df = pd.DataFrame(data)  # Convert dictionary to dataframe

# Method 2 FOR LOADING DATA
# url = 'https://raw.githubusercontent.com/akki8087/Big-Mart-Sales/refs/heads/master/Train.csv'
# df = pd.read_csv(url)  # Load data directly from URL if needed

# Standardize the data
from sklearn.preprocessing import StandardScaler  # For scaling data to standard format
scaler = StandardScaler()  # Create scaler instance
data_scaled = scaler.fit_transform(df)  # Scale data to have mean=0 and std=1

# Covariance matrix
cov_matrix = np.cov(data_scaled.T)  # Calculate covariance matrix of transposed data
print("\nCovariance Matrix:\n", cov_matrix)  # Print the matrix for debugging

# Eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)  # Compute eigenvalues n eigenvectors
print("\nEigen Values\n", eigenvalues)  # Display eigenvalues
print("\nEigen Vectors\n", eigenvectors)  # Display eigenvectors

# Sort eigenvalues and eigenvectors
sorted_indices = np.argsort(eigenvalues)[::-1]  # Sort eigenvalues in descending order
sorted_eigenvalues = eigenvalues[sorted_indices]  # Rearrange eigenvalues by sorted index
sorted_eigenvectors = eigenvectors[:, sorted_indices]  # Rearrange eigenvectors the same way

# Choose top 2 principal components
n_components = 2  # Set number of principal components
principal_components = sorted_eigenvectors[:, :n_components]  # Pick first two eigenvectors
print("\nPrincipal Components: \n", principal_components)  # Show principal components

# Project data onto principal components
transformed_data = np.dot(data_scaled, principal_components)  # Reduce dimensions of data
print("\nTransformed Data:\n", transformed_data)  # Transformed data after PCA

# Explained variance ratio using PCA
pca = PCA(n_components=n_components)  # PCA model with 2 components
pca.fit(data_scaled)  # Fit the scaled data
print("\nExplained Variance Ratio:", pca.explained_variance_ratio_)  # How much variance is explained by each PC

# Create a DataFrame for visualization
pca_df = pd.DataFrame(
    transformed_data,
    columns=["Principal Component 1", "Principal Component 2"]  # Name for new PCA components
)

# Plot the principal components
plt.figure(figsize=(8, 6))  # Set figure size
plt.scatter(
    pca_df["Principal Component 1"],
    pca_df["Principal Component 2"],
    c="blue",  # Color the points blue
    edgecolor="k",  # Add black edge to points
    s=100  # Make points larger
)
plt.title("PCA of Students' Study Patterns", fontsize=16)  # Title of the plot
plt.xlabel("Principal Component 1", fontsize=14)  # Label x-axis
plt.ylabel("Principal Component 2", fontsize=14)  # Label y-axis
plt.grid(True)  # Add gridlines
plt.show()  # Show the scatter plot


























# Annova
import pandas as pd  # Importing pandas for data manipulation
import scipy.stats as stats  # Import stats module from scipy for statistical tests

# Sample data: Scores of students in different subjects
data = {
    "Math": [85, 90, 88, 92, 75, 80, 95, 85, 89, 91],  # Math scores
    "Science": [88, 86, 89, 91, 78, 84, 90, 87, 85, 88],  # Science scores
    "English": [82, 80, 85, 83, 79, 81, 84, 83, 86, 87]  # English scores
}

# Convert data to a DataFrame
df = pd.DataFrame(data)  # Creating a DataFrame from the sample data

# Perform ANOVA test
f_stat, p_value = stats.f_oneway(df["Math"], df["Science"], df["English"])  # Calculate the F-statistic and p-value

# Display the results
print("ANOVA Results:")  # Print the results header
print(f"F-Statistic: {f_stat:.2f}")  # Print the F-statistic value with two decimal places
print(f"P-Value: {p_value:.4f}")  # Print the p-value with four decimal places

# Interpret the results
alpha = 0.05  # Significance level (5%)
if p_value < alpha:  # If p-value is less than alpha, reject the null hypothesis
    print("\nConclusion: There is a significant difference between the means of the groups.")  # Significant difference found
else:  # Otherwise, fail to reject the null hypothesis
    print("\nConclusion: There is no significant difference between the means of the groups.")  # No significant difference found






























# Z - Test

import numpy as np  # Importing numpy for numerical operations
from scipy import stats  # Import stats module from scipy for statistical functions

# Given data
population_mean = 480  # Mean weight of coffee can in population
sample_mean = 398  # Mean weight of coffee can in the sample
population_std = 8  # Standard deviation of the population
sample_size = 100  # Size of the sample taken

# Z-test
z_score = (sample_mean - population_mean) / (population_std / np.sqrt(sample_size))  # Calculate z-score
p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))  # Calculate p-value for two-tailed test

# Print the results
print(f"Z-Score: {z_score}")  # Print calculated z-score
print(f"P-Value: {p_value}")  # Print calculated p-value

# Define significance level
alpha = 0.05  # Significance level

# Check if p-value is less than alpha
if p_value < alpha:  # If p-value is smaller, reject the null hypothesis
  print("Reject the null hypothesis: Significant difference in coffee can weight.")  # Show that the difference is significant
else:
  print("Fail to reject the null hypothesis: No significant difference in coffee can weight.")  # Show no significant difference





































# T TEST
import numpy as np  # Importing numpy for numerical operations
from scipy import stats  # Import stats module from scipy for statistical functions

# method 1 (manual calculation)
population_mean = 50  # Mean weight of coffee can in population
sample_mean = 48  # Mean weight of coffee can in sample
population_std = 5  # Standard deviation of the population
sample_size = 15  # Size of the sample

# method 2 (alternative method using sample data)
# sample_data = [398, 399, 401, 402, 397, 396, 403, 395, 400, 398]  # Sample data
# population_mean = 400  # Mean weight of coffee can in population
# sample_mean = np.mean(sample_data)  # Mean of the sample
# sample_std = np.std(sample_data, ddof=1)  # Standard deviation of the sample
# sample_size = len(sample_data)  # Sample size

# t-statistic calculation
t_stat = (sample_mean - population_mean) / (population_std / np.sqrt(sample_size))  # Compute the t-statistic
print(f"The T score is: {t_stat}")  # Print the t-statistic value

# p-value calculation for two-tailed test
p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df=sample_size - 1))  # Compute the p-value based on t-distribution
print(f"The P value is: {p_value}")  # Print the p-value

# Define significance level
alpha = 0.05  # Significance level (5%)

# Hypothesis testing
if p_value < alpha:  # If p-value is less than alpha, reject the null hypothesis
  print("Reject the null hypothesis: There is a significance difference in coffee can weight.")  # Significant difference
else:  # Otherwise, fail to reject the null hypothesis
  print("Fail to reject the null hypothesis: No significance difference in coffee can weight.")  # No significant difference

















































# T TEST
import numpy as np  # Importing numpy for generating random data and numeric operations
from scipy import stats  # Import stats module from scipy for statistical tests

# Given data for Class A
mean_a = 78  # Mean test score for Class A
std_a = 10  # Standard deviation of test scores for Class A
size_a = 15  # Sample size for Class A

# Given data for Class B
mean_b = 85  # Mean test score for Class B
std_b = 8  # Standard deviation of test scores for Class B
size_b = 15  # Sample size for Class B

# Generate random samples based on the mean and std deviation
np.random.seed(0)  # Set seed for reproducibility
class_a_scores = np.random.normal(mean_a, std_a, size_a)  # Generate random scores for Class A
class_b_scores = np.random.normal(mean_b, std_b, size_b)  # Generate random scores for Class B

# Perform the two-sample t-test
t_statistic, p_value = stats.ttest_ind(class_a_scores, class_b_scores)  # Conduct t-test

# Print the results
print(f"T-statistic: {t_statistic}")  # Print calculated t-statistic
print(f"P-value: {p_value}")  # Print the p-value

# Conclusion
alpha = 0.05  # Significance level (5%)
if p_value < alpha:  # If p-value is smaller than alpha, reject the null hypothesis
    print("Reject the null hypothesis: There is a significant difference in test scores between the classes.")  # Significant difference found
else:  # Otherwise, fail to reject the null hypothesis
    print("Fail to reject the null hypothesis: No significant difference in test scores between the classes.")  # No significant difference found
