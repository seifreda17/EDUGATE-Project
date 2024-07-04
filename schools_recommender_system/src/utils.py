import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import spacy

__data = None


def load_artifacts():
    global __data
    __data = pd.read_csv("../data/model_data.csv")



def recommend_schools(school_ids, num_recommendations=10):
    nlp = spacy.load("en_core_web_sm")
    print(type(school_ids) is int)
    queried_schools = __data[__data['ID'].isin(school_ids)]

    queried_school_names = queried_schools['school_name'].tolist()
    queried_school_tokens = [nlp(name) for name in queried_school_names]
    queried_school_vectors = [token.vector for token in queried_school_tokens]
    queried_school_vectors_mean = pd.DataFrame(queried_school_vectors).mean(axis=0).values

    queried_features = queried_schools[
        ['cert', 'type', 'fees_normalized', 'Latitude_normalized', 'Longitude_normalized']].mean(axis=0).values

    features = __data[['cert', 'type', 'fees_normalized', 'Latitude_normalized', 'Longitude_normalized']].values

    similarity = cosine_similarity(features, queried_features.reshape(1, -1))

    name_similarity = cosine_similarity([queried_school_vectors_mean],
                                        [token.vector for token in nlp.pipe(__data['school_name'])])

    __data['similarity'] = similarity.flatten() + name_similarity.flatten()
    recommended_schools = __data.sort_values(by='similarity', ascending=False).head(num_recommendations)

    recommendations_list = []
    for index, row in recommended_schools.iterrows():
        recommendation_dict = {
            'ID': row['ID'],
            'school_name': row['school_name'],
            'cert': row['cert'],
            'location': row['location'],
            'type': row['type'],
            'fees': row['fees'],
            'Latitude': row['Latitude'],
            'Longitude': row['Longitude']
        }
        recommendations_list.append(recommendation_dict)

    return recommendations_list

if __name__ == "__main__":
    load_artifacts()
    recommendations = recommend_schools(500)
    print(recommendations)