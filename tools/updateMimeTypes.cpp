#include <chrono>
#include <cstdio>
#include <curl/curl.h>
#include <fstream>
#include <ios>
#include <iostream>
#include <locale>
#include <ostream>
#include <sstream>
#include <string>
#include <thread>
#include <vector>

#include "libs/json.hpp"
#include "libs/utf8/core.h"

using namespace nlohmann;

void log(std::string message) { std::cout << message << "\n"; }
static size_t write_data(char *ptr, size_t size, size_t nmemb, void *stream) {
  std::ofstream *out = static_cast<std::ofstream *>(stream);
  size_t nbytes = size * nmemb;
  out->write(ptr, nbytes);
  return nbytes;
}

void write_json(std::string input_file_name, std::string output_file_name) {
  log("Starting write to json function");
  std::ifstream input_file;
  input_file.open(input_file_name, std::ios::binary);
  if (input_file.bad()) {
    log("File stream encountered an error");
  }
  // read file
  json output;
  std::string container;
  bool skippedLine1 = false;
  // preprint for posterity
  std::string line1 = "";
  // while (!input_file.eof() && input_file.good()){
  //   input_file >> line1;
  //   log("[Posterity] Line: " + line1);
  // }
  std::string lineContainer = "";
  while (std::getline(input_file, lineContainer) && !lineContainer.empty()) {
    log("Line read is " + lineContainer);
    if (!skippedLine1) {
      skippedLine1 = true;
      log("Skipping line 1");
      continue;
    }
    // Check line for invalid UTF-8 symbols, nlohmann apparently only takes
    // those
    auto invalidCharacter =
        utf8::find_invalid(lineContainer.begin(), lineContainer.end());
    if (invalidCharacter != lineContainer.end()) {
      log("Invalid character found, fixing ...");
    }
    // set obj, csv format is
    // <name>,<type label>, <RFC spec ID>
    // loop through the line for each element separated by ','
    // the same way we're reading the while file buffer
    std::stringstream lineStream(lineContainer);
    std::vector<std::string> tempRow;
    for (std::string cell; std::getline(lineStream, cell, ',');) {
      log("Read cell with value " + cell);
      tempRow.push_back(cell);
    }
    // hacky skip of bad row?
    // once we have all cells put them in json
    output[tempRow[0]] = tempRow[1];
    fprintf(stdout, "Set cell JSON obj to key: %s and value: %s\n",
            tempRow[0].c_str(), tempRow[1].c_str());
  }
  if (input_file.bad()) {
    log("File stream encountered an error");
  }
  // after json is built stream into ofstream
  log("Creating output file stream");
  std::ofstream outputFileStream(output_file_name);
  log("Writing data...");
  outputFileStream << output.dump(4, '\t', false,
                                  json::error_handler_t::ignore);
  // for some reason the las " and } are missing
  log("Writing data to json complete");
  // once writing is complete close file
  // log("Closing ostream");
  // outputFileStream.close();
  log("writing to json complete");
  std::cout << output.dump();
}

int main(int argc, char *argv[]) {
  std::string filename = "mimetype.csv";
  std::ofstream mimeCsvStream = std::ofstream("mimetype.csv");

  CURL *curl = curl_easy_init();
  CURLcode response;
  // if curl was successfully initialized
  if (curl) {
    log("CURL open successfull");
    curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
    log("CURL verbose set");
    curl_easy_setopt(
        curl, CURLOPT_URL,
        "https://www.iana.org/assignments/media-types/application.csv");
    log("CURL target URL set");
    curl_easy_setopt(curl, CURLOPT_USERAGENT,
                     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) "
                     "Gecko/20100101 Firefox/128.0");
    log("CURL user agent <fake mozilla> set");
    // Setup request
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
    log("CURL write data to FILE* function set");
    // actually make the request
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &mimeCsvStream);
    log("CURL FILE stream set");
    log("Executing curl");
    response = curl_easy_perform(curl);
    log("CURL execution complete");
    if (response != CURLE_OK) {
      fprintf(stderr, "Error in curl request %s\n",
              curl_easy_strerror(response));
    }
    // wait for csv file to finish writing?
    // std::this_thread::sleep_for(std::chrono::milliseconds(5000));
    // once curl is complete transform CSV into json
    write_json(filename, "mime_types.json");
    // clean up curl resources
    curl_easy_cleanup(curl);
    log("CURL cleanup complete");
  }
  return 0;
}
